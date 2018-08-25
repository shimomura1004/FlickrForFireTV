export default {
  created () {
  },
  methods: {
    keyDownHandler (e) {
      // todo: control with d-pads of the remote

      const LEFT_KEY = 37
      const NEXT_KEY = 228
      const RIGHT_KEY = 39
      const PREV_KEY = 227

      switch (e.keyCode) {
        case LEFT_KEY:
        case PREV_KEY:
          if (this.onLeftPressed) {
            this.onLeftPressed(e)
          }
          break
        case RIGHT_KEY:
        case NEXT_KEY:
          if (this.onRightPressed) {
            this.onRightPressed(e)
          }
          break
        default:
          break
      }
    },
    mouseDownHandler (e) {
      if (this.onMouseDown) {
        this.onMouseDown(e)
      }
    },
    addEventHandlers () {
      window.addEventListener('mousedown', this.mouseDownHandler)
      window.addEventListener('keydown', this.keyDownHandler)
    },
    removeEventHandlers () {
      window.removeEventListener('mousedown', this.mouseDownHandler)
      window.removeEventListener('keydown', this.keyDownHandler)
    }
  }
}
