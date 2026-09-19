import apiClient from './apiClient';
import { pollVoteOrderUntilSettled } from './voteOrderService';

// axios (ESM) n'est pas transformé par Jest/CRA : le client est remplacé en bloc.
jest.mock('./apiClient', () => ({ __esModule: true, default: { get: jest.fn(), post: jest.fn() } }));

const FAST = { intervalMs: 1, timeoutMs: 500 };

describe('pollVoteOrderUntilSettled', () => {
  beforeEach(() => jest.resetAllMocks());

  it('renvoie le statut dès que la commande quitte PENDING', async () => {
    apiClient.get
      .mockResolvedValueOnce({ data: { id: 'o1', status: 'PENDING' } })
      .mockResolvedValueOnce({ data: { id: 'o1', status: 'PAID', totalPoints: 25 } });

    const result = await pollVoteOrderUntilSettled('o1', FAST);

    expect(result).toMatchObject({ status: 'PAID', totalPoints: 25 });
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });

  it("survit à une coupure réseau passagère pendant l'attente", async () => {
    apiClient.get
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ data: { id: 'o1', status: 'PAID' } });

    const result = await pollVoteOrderUntilSettled('o1', FAST);

    expect(result.status).toBe('PAID');
  });

  it('abandonne après 5 échecs consécutifs', async () => {
    apiClient.get.mockRejectedValue(new Error('Network Error'));

    await expect(pollVoteOrderUntilSettled('o1', FAST)).rejects.toThrow('Network Error');
    expect(apiClient.get).toHaveBeenCalledTimes(5);
  });

  it('abandonne tout de suite sur une erreur 4xx (commande introuvable)', async () => {
    apiClient.get.mockRejectedValue(Object.assign(new Error('nf'), { response: { status: 404 } }));

    await expect(pollVoteOrderUntilSettled('o1', FAST)).rejects.toThrow('nf');
    expect(apiClient.get).toHaveBeenCalledTimes(1);
  });

  it('signale timedOut quand la commande reste PENDING', async () => {
    apiClient.get.mockResolvedValue({ data: { id: 'o1', status: 'PENDING' } });

    const result = await pollVoteOrderUntilSettled('o1', { intervalMs: 5, timeoutMs: 30 });

    expect(result).toMatchObject({ status: 'PENDING', timedOut: true });
  });

  it("s'arrête sans erreur quand l'appelant le demande (fenêtre fermée)", async () => {
    const result = await pollVoteOrderUntilSettled('o1', { ...FAST, shouldStop: () => true });

    expect(result).toMatchObject({ cancelled: true });
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});
