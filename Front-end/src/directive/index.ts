import { directive } from "@dbfu/react-directive/directive"
// import { trace } from "@/utils/tools";

export interface AnimateType {
  name: string,
  loop: boolean,
}

// name directive name
directive("v-animate", {
  create: (value:AnimateType, props) => {
    // trace("create", value, props);
     // Example implementation of v-show
    //  if(value == null) {
    //    if(props?.style) {
    //      props.style.display = 'none';
    //    } else {
    //      props.style = { display: 'none' };
    //    }
    //  } 
  },
  // Triggered when the DOM element or component is rendered. Normally, it will only be triggered once. If the component is destroyed and rendered multiple times, this method will be triggered each time it is rendered.
  // In this method, you cannot process props, but you can access the component reference or DOM element reference and call methods on the component or DOM element.
  // ref: If it is a component, it is the component reference. If it is a DOM element, it is the DOM reference.
  // value: The value of the current directive
  // props: The props of the current component
  mounted: (el:HTMLElement, value:AnimateType, props) => {
    
    trace("mounted", el, value, props);
     // Example implementation of v-focus
     const addClass = (e:Event|null=null) => {
      trace("mounted-addClass-e", e,value)
      if(el.offsetParent === null) {          // If it is hidden, remove the scroll event listener
        window.removeEventListener('scroll', addClass,true);    
        return;
      }
      const re = el.getBoundingClientRect();
      const { top,bottom,left,right,width,height } = re;
      const h = document.documentElement.clientHeight || document.body.clientHeight;
      
      if (top < h) {
        if (!el.classList.contains(value.name)) {
          el.style.opacity = '';
          // Add the class name if it hasn't been added before (note: there's a space between the single quotes)
          el.className = `${value.name} ${el.className}`;
        }
        if (!value.loop) {
          window.removeEventListener('scroll', addClass,true);
        }
      }

      // Enable Triggering Looping Animation
      if(value.loop&&(bottom<0||top > h)){    
        el.style.opacity = '0';
        if (el.classList.contains(value.name)) {
          el.classList.remove(value.name);
        }
      }

    };
    if(el){
      // trace("hide-ref", 'classList=',el.classList,'className=',el.className);
      el.style.opacity = '0'; // Set the opacity to 0 to prevent the animation from being triggered when the page is loaded
      window.addEventListener('scroll', addClass, true);
      addClass({} as Event); // Pass an empty event object as an argument
    }


    
  },
  // This method is triggered when the component's style.display is changed from none to block
  // The parameters are the same as mounted
  show: (ref, value, props) => {
     // Example implementation of v-focus
     trace("show", ref, value, props);
    //  ref?.focus?.();
  },
  // The opposite of show
  hidden: (ref, value, props) => {
    trace("hidden", ref, value, props);
    // No use case for this currently
  },
  
});