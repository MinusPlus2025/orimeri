import {test} from 'node:test';
import assert from 'node:assert/strict';
import {venueWebsite} from '../src/lib/venue-website';
test('corrects the verified venue, including restored old results, without mutating provenance',()=>{
 const place={name:'PARADISE TOKYO / WACKO MARIA',website:'https://wackomaria.co.jp'};
 assert.equal(venueWebsite(place),'https://cdn.wackomaria.co.jp/paradisetokyo');
 assert.equal(place.website,'https://wackomaria.co.jp');
});
test('does not rewrite unrelated venues or unsafe links',()=>{
 assert.equal(venueWebsite({name:'Another shop',website:'https://wackomaria.co.jp'}),'https://wackomaria.co.jp/');
 assert.equal(venueWebsite({name:'PARADISE TOKYO',website:'https://example.com'}),'https://example.com/');
 assert.equal(venueWebsite({name:'PARADISE TOKYO',website:'javascript:alert(1)'}),null);
 assert.equal(venueWebsite({name:'PARADISE TOKYO',website:null}),null);
});
