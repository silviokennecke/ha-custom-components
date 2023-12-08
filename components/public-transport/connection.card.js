import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

class PublicTransportConnectionCard extends LitElement {
  /*static getConfigElement() {
    return document.createElement("content-card-editor");
  }*/

  static getStubConfig() {
    return {
      title: 'Next train',
      departure_station: 'Home',
      arrival_station: 'Work',
      entity: 'sensor.my_station_to_another_station',
      attributes: {
        description: 'products',
        departure_time: 'departure',
        departure_delay: 'delay',
        arrival_time: 'arrival',
        arrival_delay: 'delay_arrival',
        next_departure_time: 'next',
        next_arrival_time: 'next_on',
      },
      theme: 'deutsche-bahn',
    };
  }

  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    const title = this.config.title;
    const entity = this.config.entity;
    const theme = this.config.theme;
    const stateObj = this.hass.states[entity];

    if (!stateObj) {
      return html`
        <ha-card class="ptc-theme-${theme}">
          ${title ? html`<h1>${title}</h1>` : ''}
          <div class="not-found">Entity ${entity} not found.</div>
        </ha-card>
      `;
    }

    const icon = this.config.icon || stateObj.attributes.icon || 'mdi:train';

    const connections = {
      current: {
        description: stateObj.attributes[this.config.attributes.description].join(', ') || '',
        departure: {
          time: stateObj.attributes[this.config.attributes.departure_time],
          delay: stateObj.attributes[this.config.attributes.departure_delay] || '',
          station: stateObj.attributes[this.config.attributes.departure_station] || this.config.departure_station || '',
        },
        arrival: {
          time: stateObj.attributes[this.config.attributes.arrival_time],
          delay: stateObj.attributes[this.config.attributes.arrival_delay] || '',
          station: stateObj.attributes[this.config.attributes.arrival_station] || this.config.arrival_station || '',
        },
      },
    };

    if (this.config.attributes.next_departure_time && this.config.attributes.next_arrival_time) {
      connections.next = {
        description: stateObj.attributes[this.config.attributes.next_description] || '',
        departure: {
          time: stateObj.attributes[this.config.attributes.next_departure_time],
          delay: stateObj.attributes[this.config.attributes.next_departure_delay] || '',
          station: stateObj.attributes[this.config.attributes.next_departure_station] || this.config.departure_station || '',
        },
        arrival: {
          time: stateObj.attributes[this.config.attributes.next_arrival_time],
          delay: stateObj.attributes[this.config.attributes.next_arrival_delay] || '',
          station: stateObj.attributes[this.config.attributes.next_arrival_station] || this.config.arrival_station || '',
        },
      };
    }

    return html`
      <ha-card class="ptc-theme-${theme}">
        ${title ? html`<h1>${title}</h1>` : ''}
        <div class="ptc-main" @click="${(ev) => this._handleAction('tap')}">
          <div class="ptc-row ptc-stations">
            <div class="ptc-station-departure">${connections.current.departure.station}</div>
            <div class="ptc-icon">
              <ha-icon icon="${icon}">
            </div>
            <div class="ptc-station-arrival">${connections.current.arrival.station}</div>
          </div>
          <div class="ptc-row ptc-time-bar">
            <div class="ptc-time-bar-bullet"></div>
            <div class="ptc-time-bar-line"></div>
            <div class="ptc-time-bar-bullet"></div>
          </div>
          <div class="ptc-row ptc-connection ptc-current-connection">
            <div class="ptc-time-departure">
              ${connections.current.departure.time}
              ${connections.current.departure.delay > 0 ? html`+ ${connections.current.departure.delay}` : ''}
            </div>
            <div class="ptc-connection-description">${connections.current.description}</div>
            <div class="ptc-time-arrival">
              ${connections.current.arrival.time}
              ${connections.current.arrival.delay > 0 ? html`+ ${connections.current.arrival.delay}` : ''}
            </div>
          </div>
          ${connections.next ? html`
            <div class="ptc-row ptc-connection ptc-next-connection">
              <div class="ptc-time-departure">
                ${connections.next.departure.time}
                ${connections.next.departure.delay > 0 ? html`+ ${connections.next.departure.delay}` : ''}
              </div>
              <div class="ptc-connection-description">${connections.next.description}</div>
              <div class="ptc-time-arrival">
                ${connections.next.arrival.time}
                ${connections.next.arrival.delay > 0 ? html`+ ${connections.next.arrival.delay}` : ''}
              </div>
            </div>
          ` : ''}
        </div>
      </ha-card>
    `;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    if (!config.attributes) {
      throw new Error("You need to define attributes");
    }

    if (!config.attributes.departure_time) {
      throw new Error("You need to define the departure attribute");
    }

    if (!config.attributes.arrival_time) {
      throw new Error("You need to define the arrival attribute");
    }

    if (config.attributes.next_departure_time && !config.attributes.next_arrival_time) {
      throw new Error("If you define the next_departure attribute, you need to also define the next_arrival attribute");
    }

    this.config = {
      tap_action: {
        action: 'more-info',
      },
      ...config,
    };
  }

  getCardSize() {
    return 2;
  }

  _handleAction(action) {
    const event = new Event('hass-action', {
      bubbles: true,
      composed: true,
    });

    event.detail = {
      config: this.config,
      action: action,
    };

    this.dispatchEvent(event);
  }

  static get styles() {
    return css`
      :host {
        --public-transport-connection-card-background-color: #EC0016;
        --public-transport-connection-card-foreground-color: #FFFFFF;
        --public-transport-connection-card-size: 10px;
      
        --public-transport-connection-card-inner-padding: var(--public-transport-connection-card-size);
        --public-transport-connection-card-time-bar-size: var(--public-transport-connection-card-size);
      }

      ha-card {
        overflow: hidden;
        position: relative;
        height: 100%;
        box-sizing: border-box;

        background-color: var(--public-transport-connection-card-background-color);
        color: var(--public-transport-connection-card-foreground-color);
      }
      
      /* Card */
      h1 {
        font-family: var(--ha-card-header-font-family,inherit);
        font-size: var(--ha-card-header-font-size,24px);
        font-weight: 400;
        margin: calc(var(--public-transport-connection-card-inner-padding) * 2) calc(var(--public-transport-connection-card-inner-padding) * 1.5) calc(var(--public-transport-connection-card-inner-padding) / 2);
      }

      .ptc-main {
        display: flex;
        width: 100%;
        flex-direction: column;

        cursor: pointer;
      }
      
      .ptc-main > :first-child {
        padding-top: var(--public-transport-connection-card-inner-padding);
      }
      .ptc-main > :last-child {
        padding-bottom: var(--public-transport-connection-card-inner-padding);
      }
      
      .ptc-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 calc(var(--public-transport-connection-card-inner-padding) * 1.5);
      }
      
      /* Stations */
      .ptc-stations {
        padding-bottom: calc(var(--public-transport-connection-card-size) / 2);
      }
      
      .ptc-stations > * {
        flex: 0 1 auto;
        align-self: flex-end;
        text-align: center;
      }
      
      .ptc-station-departure,
      .ptc-station-arrival {
        flex: 1;
        text-align: left;
        font-weight: 500;
      }
          
      .ptc-station-arrival {
        text-align: right;
      }
      
      /* Time Bar */
      .ptc-time-bar-bullet,
      .ptc-time-bar-line {
        background-color: var(--public-transport-connection-card-foreground-color);
      }
      
      .ptc-time-bar-bullet {
        width: var(--public-transport-connection-card-time-bar-size);
        height: var(--public-transport-connection-card-time-bar-size);
        border-radius: calc(var(--public-transport-connection-card-time-bar-size) / 2);
      }
          
      .ptc-time-bar-line {
        flex-grow: 1;
        height: calc(var(--public-transport-connection-card-time-bar-size) / 3);
        margin: calc(var(--public-transport-connection-card-time-bar-size) / 3) calc(-1 * var(--public-transport-connection-card-time-bar-size) / 2);
      }
      
      /* Connection */
      .ptc-connection.ptc-current-connection {
        padding-top: calc(var(--public-transport-connection-card-size) / 2);
      }
          
      .ptc-connection.ptc-next-connection {
        font-size: 0.85em;
        opacity: 0.9;
      }

      .ptc-connection .ptc-time-departure,
      .ptc-connection .ptc-time-arrival {
        flex-grow: 1;
        text-align: left;
      }
      
      .ptc-connection .ptc-connection-description {
        flex-grow: 2;
        text-align: center;
      }
      
      .ptc-connection .ptc-time-arrival {
        text-align: right;
      }

      /* Themes */

      /** Deutsche Bahn **/
      .ptc-theme-deutsche-bahn {
        /* nothing to do, as this is the default */
      }

      /** Homeassistant **/
      .ptc-theme-homeassistant {
        --public-transport-connection-card-background-color: var(--ha-card-background,var(--card-background-color,#fff));
        --public-transport-connection-card-foreground-color: var(--primary-text-color);
      }

      .ptc-theme-homeassistant h1 {
        color: var(--ha-card-header-color,--primary-text-color);
      }
    `;
  }
}
  
  customElements.define("public-transport-connection-card", PublicTransportConnectionCard);