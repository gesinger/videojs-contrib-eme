import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-contrib-eme', {
  beforeEach() {
    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.strictEqual(
    typeof Player.prototype.eme,
    'function',
    'videojs-contrib-eme plugin was registered'
  );
});

QUnit.test('exposes options', function(assert) {
  assert.notOk(this.player.eme.options, 'options is unavailable at start');

  this.player.eme();
  assert.deepEqual(this.player.eme.options,
                   {},
                   'options defaults to empty object once initialized');

  this.video = document.createElement('video');
  this.video.setAttribute('data-setup', JSON.stringify({
    plugins: {
      eme: {
        applicationId: 'application-id',
        publisherId: 'publisher-id'
      }
    }
  }));
  this.fixture.appendChild(this.video);
  this.player = videojs(this.video);

  assert.ok(this.player.eme.options, 'exposes options');
  assert.strictEqual(this.player.eme.options.applicationId,
                     'application-id',
                     'exposes applicationId');
  assert.strictEqual(this.player.eme.options.publisherId,
                     'publisher-id',
                     'exposes publisherId');
});
