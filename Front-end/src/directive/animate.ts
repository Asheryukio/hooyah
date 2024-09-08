import { DirectiveBinding, ObjectDirective } from "vue";

export const animate: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const addClass = () => {
      const re = el.getBoundingClientRect();
      const { left,right,top,bottom,width,height } = re;
      const h = document.documentElement.clientHeight || document.body.clientHeight;
      
      if (top < h) {
        if (!el.classList.contains(binding.value)) {
          el.style.opacity = '';
          // Add the class name if it hasn't been added before (note: there's a space between the single quotes)
          el.className = `${binding.value} ${el.className}`;
        }
        if (binding.value) {
          window.removeEventListener('scroll', addClass);
        }

      }

      // Enable Triggering Looping Animation
      // if(bottom<0||top > h){    
      //   el.style.opacity = '0';
      //   if (el.classList.contains(binding.value)) {
      //     el.classList.remove(binding.value);
      //   }
      // }

    };

    window.addEventListener('scroll', addClass, true);
    el.style.opacity = '0';
    addClass();
  },

  unmounted(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value) {
      window.removeEventListener('scroll', binding.value);
    }
  },
};
