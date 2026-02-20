/**
 * Copyright 2026 Brandon Park
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
    });

    this.count = 0;
    this.min = -50;
    this.max = 50;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      count: { type: Number, reflect: true },
      max: {type: Number, reflect: true, final: true},
      min: {type: Number, reflect: true, final: true},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      :host([count="18"]) h3 {
        color: var(--ddd-theme-default-keystoneYellow);
      }
      :host([count="21"]) h3 {
        color: var(--ddd-theme-default-accent);
      }
      .count-label.bound {
        color: var(--ddd-theme-default-original87Pink);
      }
      .count-label {
        font: var(--ddd-font-size-3xl) var(--ddd-font-secondary);
        margin: var(--ddd-spacing-4);
      }
      button {
        margin: var(--ddd-spacing-2)
      }
      .decrement-button:hover {
        background-color: var(--ddd-theme-default-discoveryCoral);
      }
      .decrement-button:focus {
        background-color: var(--ddd-theme-default-pughBlue);
      }
      .increment-button:hover {
        background-color: var(--ddd-theme-default-discoveryCoral);
      }
      .increment-button:focus {
        background-color: var(--ddd-theme-default-pughBlue);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--counter-app-label-font-size, var(--ddd-font-size-s));
        margin: var(--ddd-spacing-12);
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <confetti-container id="confetti">
  <!--The class will add bound to the end to change the color of count-label when count is at the min or max-->
    <h3 class="count-label ${this.count === this.min || this.count === this.max ? "bound" : ""}">
      ${this.count}
    </h3>
    <button class="decrement-button" @click="${this.decrement}" ?disabled="${this.min === this.count}">-</button>
    <button class="increment-button" @click="${this.increment}" ?disabled="${this.max === this.count}">+</button>
    <slot></slot>
  </confetti-container> 
</div>`;
  }

  /**
   * increases the count by 1 until count reaches the max value
   * once count reaches the max value, the count stops increasing and returns
   */
  increment() {
    if (this.count == this.max) {
      return;
    }
    this.count++;
  }

  /**
   * decreases the count by 1 until count reaches the min value
   * once count reaches the min value, the count stops decreasing and returns
   */
  decrement() {
    if (this.count == this.min) {
      return;
    }
    this.count--;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has('count')) {
      // do your testing of the value and make it rain by calling makeItRain
      if (this.count === 21) {
        this.makeItRain();
      }
    }
  }

  makeItRain() {
    // this is called a dynamic import. It means it won't import the code for confetti until this method is called
    // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
    // will only run AFTER the code is imported and available to us
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        // This is a minor timing 'hack'. We know the code library above will import prior to this running
        // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
        // this "hack" ensures the element has had time to process in the DOM so that when we set popped
        // it's listening for changes so it can react
        setTimeout(() => {
          // forcibly set the poppped attribute on something with id confetti
          // while I've said in general NOT to do this, the confetti container element will reset this
          // after the animation runs so it's a simple way to generate the effect over and over again
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);