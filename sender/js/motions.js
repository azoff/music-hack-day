// Generated by CoffeeScript 1.7.1
var LeapEventListener, PinchListener, leapToFirebase, output, pinchHandler, progress,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

output = document.getElementById("output");

progress = document.getElementById("progress");

if (typeof LeapToFirebase === "undefined" || LeapToFirebase === null) {
  throw "No LeapToFirebase";
}

leapToFirebase = new LeapToFirebase(config.firebase_room_uri);

LeapEventListener = (function() {
  function LeapEventListener() {
    console.log("Setting up...");
  }

  LeapEventListener.prototype.listen = function() {
    return console.log("Listening for event");
  };

  LeapEventListener.prototype.sendEvent = function(event_name, value) {
    console.log("Event: " + event_name + ", Value: " + value);
    return console.error("sendEvent: not yet really sending event...");
  };

  return LeapEventListener;

})();

PinchListener = (function(_super) {
  __extends(PinchListener, _super);

  function PinchListener() {
    this.PINCH_STRENGTH_ON = .8;
    this.PINCH_STRENGTH_OFF = .4;
    console.log("Init pinch listener... Pinch On=" + this.PINCH_STRENGTH_ON + ", Off=" + this.PINCH_STRENGTH_OFF);
    this.pinched = false;
    this.pinched_finger = null;
  }

  PinchListener.prototype.findPinchingFingerType = function(hand) {
    var closest, current, distance, f, fingerIndex, pincher, _i;
    console.log("findPinchingFingerType");
    closest = 500;
    for (f = _i = 0; _i <= 4; f = ++_i) {
      current = hand.fingers[f];
      distance = Leap.vec3.distance(hand.thumb.tipPosition, current.tipPosition);
      if (current !== hand.thumb && distance < closest) {
        closest = distance;
        pincher = current;
        fingerIndex = f;
      }
    }
    return {
      pincher: pincher,
      fingerIndex: fingerIndex
    };
  };

  PinchListener.prototype.updateUi = function(pinchStrength) {
    if (output && progress) {
      output.innerHTML = pinchStrength;
      return progress.style.width = pinchStrength * 100 + "%";
    } else {
      return console.error("UI hooks aren't configured. output (" + output + "), progress (" + progress + ")");
    }
  };

  PinchListener.prototype.sendEvent = function(type, value) {
    var firebaseEvent;
    console.log("Leap Event received. Translating and sending FirebaseEvent");
    firebaseEvent = leapToFirebase.translate({
      type: type,
      value: value
    });
    if (firebaseEvent != null) {
      return leapToFirebase.sendToFirebase(firebaseEvent);
    }
  };

  PinchListener.prototype.listen = function(hand) {
    var fingerIndex, pinchStrength, pincher, _ref;
    pinchStrength = hand.pinchStrength.toPrecision(2);
    this.updateUi(pinchStrength);
    if (!this.pinched && pinchStrength > this.PINCH_STRENGTH_ON) {
      this.pinched = true;
      this.pinched_finger = fingerIndex;
      _ref = this.findPinchingFingerType(hand), pincher = _ref.pincher, fingerIndex = _ref.fingerIndex;
      return this.sendEvent('pinch-start', fingerIndex);
    } else if (this.pinched && pinchStrength < this.PINCH_STRENGTH_OFF) {
      this.sendEvent('pinch-end', this.pinched_finger);
      this.pinched = false;
      return this.pinched_finger = null;
    }
  };

  return PinchListener;

})(LeapEventListener);

pinchHandler = new PinchListener;

Leap.loop({
  background: true
}, {
  hand: function(hand) {
    pinchHandler.listen(hand);
  }
});
