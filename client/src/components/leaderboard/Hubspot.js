import React from "react";
import Filter from "bad-words"
import { useToast } from "../utils/Toast";
import { checkIfAliasIsPresent } from "./checkIfAliasExist";

const filter = new Filter()

class HubspotForm extends React.Component{
  constructor() { 
    super()
    this.formRef = React.createRef();
  }

  componentDidMount() {
    if (window.hbspt) {
      // @ts-ignore
      window.hbspt.forms.create({
        target: "#hubspotForm",
        ...this.props,
        onFormReady: this.onFormReady,
        submitButtonClass: "leaderboard-alias-submit-button",
        onFormSubmitted: this.onFormSubmitted,
        onFormSubmit:this.onFormSubmit
      });
    }
  }

  onFormReady = (form) => { 
    const spans = form.querySelectorAll("span");
    const legends = form.querySelectorAll(".hs-field-desc");
    const buttons = form.querySelectorAll(".leaderboard-alias-submit-button");
    const inputs = form.querySelectorAll("input");


    const emailElement = spans[0]
    const usernameElement = spans[2]
    const label = legends[1]
    const addressInput = inputs[2]
    const ethernautAddressLabel = spans[4]
    const checkboxLabel = spans[5]

    const styles = getComputedStyle(document.documentElement);

    const textColor = styles.getPropertyValue('--secondary-color');
    const bgColor = styles.getPropertyValue('--primary-color');

    emailElement.style.color = textColor;
    usernameElement.style.color = textColor;
    ethernautAddressLabel.style.color = textColor;
    checkboxLabel.style.color = textColor;
    
    label.style.color = textColor;
    label.style.opacity = 0.7;

    buttons[0].style.backgroundColor = textColor;
    buttons[0].style.border = "none";
    buttons[0].style.color = bgColor;
    buttons[0].style.padding = '8px';
    buttons[0].style.borderRadius = '5px';
    buttons[0].style.cursor = 'pointer';

    addressInput.style.pointerEvents = 'none';
    setNativeValue(addressInput, this.props.currentUser);

    form.addEventListener('submit', async (event) => { 
      const alias = event.srcElement[1].value;
      const email = event.srcElement[0].value;
      if (!(alias && email)) { 
        this.props.toast("Please fill in all the fields");
        event.stopPropagation();
        return;
      }
      if (filter.isProfane(alias)) { 
        this.props.toast("Please don't use offensive words in your alias");
        event.stopPropagation();
        return;
      }
      if(filter.isProfane(email)) { 
        this.props.toast("Please don't use offensive words in your email");
        event.stopPropagation();
        return;
      }
      if(await checkIfAliasIsPresent(alias)) { 
        this.props.toast("This alias is already taken");
        event.stopPropagation();
      }
    })
  }

  onFormSubmitted = (form) => { 
    form.remove();
    const styles = getComputedStyle(document.documentElement);
    const textColor = styles.getPropertyValue('--secondary-color');
    const outerElement = document.querySelector('#hubspotForm')
    const element = document.createElement('div')
    element.innerHTML = "Thanks for submitting the form."
    element.style.color = textColor
    element.style.position = 'relative'
    element.style.fontSize = '17px'
    outerElement.insertAdjacentElement('afterbegin', element)

    // change the height of modal
    const modal = document.querySelector('.leaderboard-modal-body')
    modal.style.height = '150px'
  }

  render() {
    return (
      <>
        <div>
          <div ref={this.formRef} id="hubspotForm" />
        </div>
      </>
    );
  }
}


function WithToast(Component) {
  return function WrappedComponent(props) {
    const { Toast, toast } = useToast(2)
    return (
      <>
        {Toast}
        <Component toast={toast} {...props} />
      </>
    );
  };
}

function setNativeValue(element, value) {
    let lastValue = element.value;
    element.value = value;
    let event = new Event("input", { target: element, bubbles: true });
    // React 15
    event.simulated = true;
    // React 16
    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
}

export default WithToast(HubspotForm);