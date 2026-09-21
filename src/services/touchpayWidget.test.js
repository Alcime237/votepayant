describe('touchpayWidget', () => {
  let widget;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    delete window.CryptoJS;
    window.sendPaymentInfos = jest.fn();
    widget = require('./touchpayWidget');
  });

  afterEach(() => {
    jest.useRealTimers();
    delete window.sendPaymentInfos;
    delete window.CryptoJS;
  });

  // Jest 27 (CRA) n'a pas advanceTimersByTimeAsync : on avance par pas de 50 ms (= le pas de
  // scrutation du chargeur) en laissant les promesses se résoudre entre chaque pas.
  const advance = async (ms) => {
    for (let elapsed = 0; elapsed < ms; elapsed += 50) {
      jest.advanceTimersByTime(50);
      await Promise.resolve();
    }
  };

  const params = { agencyCode: 'AG', apiKey: 'KEY', website: 'exemple.sn', city: 'Dakar', amount: '1000' };

  it("n'appelle sendPaymentInfos qu'une fois CryptoJS chargé par le SDK (sinon ReferenceError)", async () => {
    const opening = widget.openTouchPayWidget(params);

    await advance(500);
    expect(window.sendPaymentInfos).not.toHaveBeenCalled();

    window.CryptoJS = {};
    await advance(100);
    await opening;

    expect(window.sendPaymentInfos).toHaveBeenCalledTimes(1);
  });

  it('transmet les 12 paramètres positionnels du SDK, montant en nombre', async () => {
    window.CryptoJS = {};
    await widget.openTouchPayWidget(params);

    const args = window.sendPaymentInfos.mock.calls[0];
    expect(args).toHaveLength(12);
    expect(args.slice(1)).toEqual(['AG', 'KEY', 'exemple.sn', '', '', 1000, 'Dakar', '', '', '', '']);
  });

  it("abandonne avec une erreur claire si CryptoJS n'arrive jamais, et permet de réessayer", async () => {
    const failing = widget.loadTouchPaySdk();
    const assertion = expect(failing).rejects.toThrow('CryptoJS indisponible');
    await advance(11000);
    await assertion;

    // La promesse en échec n'est pas conservée : un nouvel essai réussit dès que CryptoJS est là
    window.CryptoJS = {};
    await expect(widget.loadTouchPaySdk()).resolves.toBeUndefined();
  });
});
