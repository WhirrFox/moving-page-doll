// yes she's real now!!
const defaultZIndex = 10;
let toLoad = 0;
let patTimer;

class BodyPart {
  constructor(
    filename,
    left,
    top,
    anchor_left,
    anchor_top,
    z_index,
    children = {},
  ) {
    this.filename = filename;
    this.left = left;
    this.anchor_left = anchor_left;
    this.anchor_top = anchor_top;
    this.children = children;
    this.el = document.createElement("div");
    this.el.style.left = left - anchor_left + "px";
    this.el.style.top = top - anchor_top + "px";
    this.el.style.transformOrigin = `${anchor_left}px ${anchor_top}px`;
    this.el.style.transform = "rotate(0deg)";
    this.img = document.createElement("img");
    this.img.src = filename == "" ? "" : `images/${filename}`;
    this.el.style.zIndex = z_index + defaultZIndex;
    this.img.style.zIndex = z_index + defaultZIndex;
    this.img.draggable = false;

    Object.entries(children).forEach(([key, part]) => {
      part.el.id = key;
      this.el.appendChild(part.el);
      this[key] = part;
      parts[key] = part;
    });
    this.el.appendChild(this.img);

    if (this.filename == "") return;
    toLoad++;
    this.img.addEventListener("load", () => {
      toLoad--;
      if (toLoad == 0)
        document.getElementById("characterBox").style.opacity = 1;
    });
  }

  setTransform(options) {
    this.el.style.transform = Object.entries(options)
      .map(([key, data]) => `${key}(${data})`)
      .join(" ");
  }

  setImage(filename) {
    this.img.src = filename == "" ? "" : `images/${filename}`;
  }
}

class Eyes extends BodyPart {
  constructor(
    filename,
    left,
    top,
    anchor_left,
    anchor_top,
    z_index,
    children = {},
  ) {
    super(filename, left, top, anchor_left, anchor_top, z_index, children);
    this.interval = -1;
  }

  blinkAnimation(iterations = null, direction = "alternate") {
    const blinkTimes = iterations ?? (Math.random() < 0.25 ? 2 : 1) * 2;
    this.children.eyeholes.animation = this.children.eyeholes.el.animate(
      [
        {
          clipPath: `polygon(0% 10%, 20% 0%, 80% 0%, 100% 10%, 100% 100%, 0% 100%)`,
          transform: "translateY(0px)",
        },
        {
          clipPath: `polygon(0% 130%, 20% 120%, 80% 130%, 100% 120%, 100% 100%, 0% 100%)`,
          transform: "translateY(-32px)",
        },
      ],
      {
        duration: 100,
        iterations: blinkTimes,
        direction: direction,
      },
    );
    this.children.eyelids.animation = this.children.eyelids.el.animate(
      [
        {
          transform: "translateY(0px)",
        },
        {
          transform: "translateY(80px)",
        },
      ],
      {
        duration: 100,
        iterations: blinkTimes,
        direction: direction,
      },
    );
  }

  startBlinking() {
    if (this.interval != -1) return;
    this.interval = setInterval(() => this.blinkAnimation(), 4000);
  }
  stopBlinking() {
    if (this.interval == -1) return;
    clearInterval(this.interval);
    this.interval = -1;
    if (this.children.eyeholes.animation)
      this.children.eyeholes.animation.cancel();
    if (this.children.eyelids.animation)
      this.children.eyelids.animation.cancel();
  }

  async closeEyes() {
    this.stopBlinking();

    this.blinkAnimation(1, "normal");
    await this.children.eyelids.animation.finished;
    this.children.eyeholes.el.style.clipPath =
      "polygon(0% 130%, 20% 120%, 80% 130%, 100% 120%, 100% 100%, 0% 100%)";
    this.children.eyeholes.setTransform({
      translateY: "-32px",
    });
    this.children.eyelids.setTransform({
      translateY: "70px",
      scaleY: "-1",
    });
  }

  async openEyes() {
    this.children.eyelids.setTransform({
      translateY: "70px",
      scaleY: "1",
    });
    this.blinkAnimation(1, "reverse");
    await this.children.eyelids.animation.finished;
    this.children.eyeholes.el.style.clipPath = "";
    this.children.eyeholes.setTransform({
      translateY: "0px",
    });
    this.children.eyelids.setTransform({
      translateY: "0px",
      scaleY: "1",
    });

    this.startBlinking();
  }
}

class Ears extends BodyPart {
  constructor(
    filename,
    left,
    top,
    anchor_left,
    anchor_top,
    z_index,
    children = {},
  ) {
    super(filename, left, top, anchor_left, anchor_top, z_index, children);
    this.timeout = -1;
  }

  twitchAnimation() {
    if (Math.random() < 0.5) {
      this.animation = this.children.lEar.el.animate(
        [
          { transform: "rotate(0)" },
          { transform: "rotate(-20deg) translateX(-25px)" },
          { transform: "rotate(50deg) translate(40px,85px)" },
          { transform: "rotate(0deg)" },
        ],
        {
          duration: 250,
          easing: "ease-in-out",
        },
      );
    } else {
      this.animation = this.children.rEar.el.animate(
        [
          { transform: "rotate(0)" },
          { transform: "rotate(20deg) translateX(25px)" },
          { transform: "rotate(-50deg) translate(-40px,85px)" },
          { transform: "rotate(0deg)" },
        ],
        {
          duration: 250,
          easing: "ease-in-out",
        },
      );
    }

    this.timeout = setTimeout(
      () => this.twitchAnimation(),
      11000 + Math.random() * 10000,
    );
  }

  startAnimation() {
    if (this.timeout != -1) return;
    this.timeout = setTimeout(() => this.twitchAnimation(), 21000);
  }
  stopAnimation() {
    if (this.interval == -1) return;
    clearTimeout(this.timeout);
    this.timeout = -1;
    if (this.animation) this.animation.cancel();
  }

  earsUp() {
    this.children.lEar.setTransform({
      rotate: "0deg",
    });
    this.children.rEar.setTransform({
      rotate: "0deg",
    });
    this.startAnimation();
  }
  earsDown() {
    this.children.lEar.setTransform({
      rotate: "50deg",
      translate: "40px,75px",
    });
    this.children.rEar.setTransform({
      rotate: "-50deg",
      translate: "-40px,75px",
    });
    this.stopAnimation();
  }
}

class FrontHair extends BodyPart {
  constructor(
    filename,
    left,
    top,
    anchor_left,
    anchor_top,
    z_index,
    children = {},
  ) {
    super(filename, left, top, anchor_left, anchor_top, z_index, children);
    this.velocity = 0;

    this.inTransition = false;
    this.children.hairLBang.el.addEventListener("transitionend", () =>
      this.move(),
    );
  }

  addVelocity(velocity) {
    if (this.velocity == 0) {
      this.velocity += velocity;
      this.move();
    } else {
      this.velocity += velocity;
    }
  }

  setBangsTransform(options) {
    this.children.hairLBang.setTransform(options);
    this.children.hairRBang.setTransform(options);
  }

  move() {
    this.velocity *= -0.3;
    if (Math.abs(this.velocity) < 0.1) this.velocity = 0;

    this.setBangsTransform({
      rotate: this.velocity + "deg",
    });
  }
}

const parts = {};
parts.character = new BodyPart("", 0, 0, 0, 0, 0, {
  body: new BodyPart("Body2.webp", 620, 550, 219, 0, 0, {
    tail: new BodyPart("Tail.webp", 260, 450, 15, 150),
    hairBack: new BodyPart("HairBack.webp", 228, -342, 322, 0, -10, {
      ears: new Ears("", 0, 0, 0, 0, -20, {
        lEar: new BodyPart("LEar.webp", 290 + 150, 0, 105, 150),
        rEar: new BodyPart("REar.webp", 47 + 150, 0, 105, 150),
      }),
    }),
    bodyC: new BodyPart("BodyC2.webp?1", 59, 77, 0, 0, 1),
    lArm: new BodyPart("LArm2.webp", 343, 178, 27, 81, -2, {
      lArmC: new BodyPart("LArmC2.webp?1", -4, -14, 0, 0, 0),
    }),
    rArm: new BodyPart("RArm2.webp", 117, 178, 204, 81, -2, {
      rArmC: new BodyPart("RArmC2.webp?1", 64, -14, 0, 0, 0),
    }),
    head: new BodyPart("Head.webp?1", 228, 38, 168, 350, 1, {
      eyes: new Eyes("", 166, 231, 106, 48, 4, {
        eyeholes: new BodyPart("Eyes.webp", 106, 48, 106, 48, 4, {
          eyeballs: new BodyPart("Eyeballs.webp", 106, 48, 77, 15, 5),
        }),
        eyelids: new BodyPart("Eyelids.webp", 106, 10, 128, 15, 5),
        eyebrowns: new BodyPart("Eyebrowns.webp", 106, -20, 132, 15, 5),
      }),
      mouth: new BodyPart("Mouth.webp", 170, 310, 25, 7, 4),
    }),
    hair: new FrontHair("", 228, 38, 168, 350, 2, {
      hairFront: new BodyPart("HairFront.webp?1", 168, -10, 174, 0, 2),
      hairLBang: new BodyPart("HairLBang.webp", 300, 120, 80, 0, 3),
      hairRBang: new BodyPart("HairRBang.webp", 65, 120, 80, 0, 3),
    }),
  }),
  lLeg: new BodyPart("LLeg.webp", 700, 1220, 68, 10),
  rLeg: new BodyPart("RLeg.webp", 540, 1220, 68, 10),
});

characterBox.appendChild(parts.character.el);
characterBox.oncontextmenu = function () {
  return false;
};

parts.eyes.startBlinking();
parts.ears.startAnimation();

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  Length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  Normalize() {
    const length = this.Length();
    return new Vector(this.x / length, this.y / length);
  }
}

document.querySelector("body").addEventListener("mousemove", move);
document
  .querySelector("body")
  .addEventListener("touchmove", (e) => move(e.touches[0]));
function move(event) {
  if (sleeping && !event.ignoreSleep) return;

  const rectSophia = parts.eyeballs.el.getBoundingClientRect();
  const rect = document.querySelector("body").getBoundingClientRect();
  const sophiaX = rectSophia.left + rectSophia.width / 2;
  const sophiaY = rectSophia.top + rectSophia.height / 2;

  const vectorRange = 300;
  let vector = new Vector(
    (event.clientX - sophiaX) / vectorRange,
    (event.clientY - sophiaY) / vectorRange,
  );
  if (vector.Length() > 1) {
    vector = vector.Normalize();
  }

  if (sleeping) {
    vector.x = 0;
    vector.y = 0;
  }

  let multiplier = 1.75;

  const yDeg = vector.x * 6 * multiplier;
  const xDeg = vector.y * -6 * multiplier;
  const rotate = vector.x * 2 * multiplier;
  const faceMoveX = vector.x * 2 * multiplier;
  const faceMoveY = vector.y * 5 * multiplier;

  parts.head.setTransform({
    translateX: faceMoveX + "px",
    translateY: faceMoveY + "px",
    rotateX: xDeg + "deg",
    rotateY: yDeg + "deg",
    rotate: rotate + "deg",
  });

  parts.hair.setTransform({
    translateX: faceMoveX * (2 / 3) + "px",
    translateY: Math.max(-2, faceMoveY * (2 / 3)) + "px",
    rotate: rotate * (1 / 3) + "deg",
  });

  parts.hair.addVelocity((event.movementX / rect.width) * 15);

  parts.hairBack.setTransform({
    translateX: -faceMoveX / 2 + "px",
    translateY: -faceMoveY + "px",
    rotateX: xDeg + "deg",
    rotateY: yDeg + "deg",
  });

  parts.eyeballs.setTransform({
    translateX: vector.x * 2 + "px",
    translateY: vector.y * 2 + "px",
  });
}

let mouth2Image;
fetch("images/Mouth2.webp").then(
  async (r) => (mouth2Image = URL.createObjectURL(await r.blob())),
);
parts.character.el.addEventListener("mousemove", () => {
  if (sleeping || patTimer) {
    parts.mouth.setImage("Mouth.webp");
    parts.mouth.setTransform({
      translateY: "0px",
    });
  } else {
    parts.mouth.img.src = mouth2Image;
    parts.mouth.setTransform({
      translateY: "-10px",
    });
  }
});
parts.character.el.addEventListener("mouseleave", () => {
  parts.mouth.setImage("Mouth.webp");
  parts.mouth.setTransform({
    translateY: "0px",
  });
});

let coatVisible = true;
document.getElementById("characterClothes").addEventListener("click", () => {
  coatVisible = !coatVisible;
  parts.bodyC.el.style.visibility = coatVisible ? "" : "hidden";
  parts.lArmC.el.style.visibility = coatVisible ? "" : "hidden";
  parts.rArmC.el.style.visibility = coatVisible ? "" : "hidden";
});

let sleeping = false;
document.getElementById("characterSleep").addEventListener("click", () => {
  if (patTimer) return;
  sleeping = !sleeping;
  if (sleeping) {
    stopAnimations();
    parts.eyes.closeEyes();
    parts.ears.stopAnimation();
    move({ ignoreSleep: true, clientX: 0, clientY: 0 });
  } else {
    startAnimations();
    parts.eyes.openEyes();
    parts.ears.stopAnimation();
  }
});

const characterBoxWrapper = document.getElementById("characterBoxWrapper");
const characterButtons = document.getElementById("characterButtons");

// animations
let animations = [];
function startAnimations() {
  animations.push(
    parts.lArm.el.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(-4deg)" }],
      {
        duration: 6000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      },
    ),
    parts.rArm.el.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(4deg)" }],
      {
        duration: 6000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      },
    ),
    parts.body.el.animate(
      [{ transform: "translateY(0px)" }, { transform: "translateY(-2px)" }],
      {
        duration: 2500,
        delay: 1000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in",
      },
    ),
    parts.body.img.animate(
      [
        { transform: "translateY(0px)" },
        { transform: "scaleY(1.0005) translateY(-2px)" },
      ],
      {
        duration: 2500,
        delay: 1000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      },
    ),
    parts.bodyC.img.animate(
      [
        { transform: "scaleY(1) translateY(0px)" },
        { transform: "scaleY(1.0005) translateY(-2px)" },
      ],
      {
        duration: 2500,
        delay: 1000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      },
    ),
    parts.tail.el.animate(
      [{ transform: "rotate(5deg)" }, { transform: "rotate(-15deg)" }],
      {
        duration: 4000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      },
    ),
  );
}
function stopAnimations() {
  animations.forEach((a) => {
    a.cancel();
  });
  animations = [];
}
startAnimations();

// headpats :3
parts.hairFront.el.addEventListener("mousemove", (e) => {
  showParticles(e.clientX, e.clientY);
  headpats(e.clientX, e.clientY);
});

parts.hairFront.el.addEventListener("touchmove", (e) => {
  isMobile = true;
  const client = e.touches[0];
  showParticles(client.clientX, client.clientY);
  headpats(client.clientX, client.clientY);
});

let prevScreenX = 0;
let movement = 0;
let patCounted = false;
let pats = 0;
let patTime = -1;
function headpats(x, y) {
  let movementX = x - prevScreenX;
  prevScreenX = x;

  // check patting direction
  if (Math.sign(movementX) !== Math.sign(movement)) {
    movement = movementX;
    patCounted = false;
  } else {
    movement += movementX;
  }

  // check if it was a pat
  if (!patCounted && Math.abs(movementX) > 5) {
    patCounted = true;
    pats++;
    if (pats <= 4) {
      return;
    }
    patTime = 2;
    if (!patTimer) {
      startHeadpats();
      patTimer = setInterval(() => {
        patTime--;
        if (patTime < 0) {
          clearInterval(patTimer);
          patTimer = null;
          pats = 0;
          stopHeadpats();
        }
      }, 1000);
    }
  }
}

async function startHeadpats() {
  if (sleeping) return;
  parts.eyes.closeEyes();
  parts.ears.earsDown();
}
async function stopHeadpats() {
  if (sleeping) return;
  parts.eyes.openEyes();
  parts.ears.earsUp();
}

let canShowParticle = true;
function showParticles(x, y) {
  if (canShowParticle && patTime > 0) {
    const rect = parts.hairFront.el.getBoundingClientRect();

    createParticle(x - rect.left, y - rect.top);
    canShowParticle = false;
    setTimeout(() => (canShowParticle = true), 600);
  }
}

function createParticle(x, y) {
  x *= 2;
  y *= 2;
  let img = document.createElement("img");
  img.src = "images/heart.webp";
  img.style.position = "absolute";
  img.style.left = x + "px";
  img.style.top = y + "px";
  img.style.width = "75px";
  img.style.height = "75px";
  img.style.rotate = Math.random() * 40 - 20 + "deg";
  parts.hairFront.el.appendChild(img);

  let opacity = 200;
  let dx = Math.random() >= 0.5 ? 0.25 : -0.25;
  const p = setInterval(() => {
    x += dx;
    y -= 2.75;
    opacity -= 0.75;
    img.style.top = y + "px";
    img.style.left = Math.floor(x) + "px";
    img.style.opacity = opacity + "%";
    if (opacity <= 0) {
      img.remove();
      img = null;
      clearInterval(p);
    }
  }, 10);
}
