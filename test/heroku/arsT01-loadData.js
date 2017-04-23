describe('Data is loaded',function(){
    it('should show a bunch of data', function(){
        browser.get('https://sos161712jhh-sandbox-sos161712jhh.c9users.io/ars-manager/');
        var rankings = element.all(by.repeater('stat in stats'));
        expect(rankings.count()).toBeGreaterThan(0);
    })
});