<template>
  <component
    :is="isLink ? 'router-link' : 'button'"
    :to="isLink ? to : undefined"
    :class="classes"
    :disabled="!isLink && disabled"
    @click="onClick"
  >
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline', 'text'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Object],
      default: null
    }
  },
  computed: {
    classes() {
      return {
        'base-button': true,
        [`base-button--${this.variant}`]: true,
        [`base-button--${this.size}`]: true,
        'base-button--disabled': this.disabled
      };
    },
    isLink() {
      return this.to !== null;
    }
  },
  methods: {
    onClick(event) {
      if (this.disabled) {
        event.preventDefault();
        return;
      }
      this.$emit('click', event);
    }
  }
};
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.base-button--primary {
  background-color: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: #2563eb;
  border-color: #2563eb;
}

.base-button--secondary {
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #d1d5db;
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: #e5e7eb;
}

.base-button--outline {
  background-color: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.base-button--outline:hover:not(.base-button--disabled) {
  background-color: rgba(59, 130, 246, 0.1);
}

.base-button--text {
  background-color: transparent;
  color: #3b82f6;
  border: none;
  padding: 0.5rem;
}

.base-button--text:hover:not(.base-button--disabled) {
  color: #2563eb;
  text-decoration: underline;
}

.base-button--small {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.base-button--medium {
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
}

.base-button--large {
  font-size: 1.125rem;
  padding: 1rem 2rem;
}

.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>