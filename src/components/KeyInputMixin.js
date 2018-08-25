export default {
  created () {
  },
  methods: {
    addKeyEventHandlers (query) {
      // todo: control with d-pads of the remote

      const LEFT_KEY = 37
      const NEXT_KEY = 228
      const RIGHT_KEY = 39
      const PREV_KEY = 227

      let index = 0

      window.addEventListener('mousedown', (e) => {
        e.stopPropagation()
        e.preventDefault()

        let targets = document.querySelectorAll(query)
        this.$router.push(targets[index].href.split('#')[1])
      }, true)

      window.addEventListener('keydown', (e) => {
        let targets = document.querySelectorAll(query)
        switch (e.keyCode) {
          case LEFT_KEY:
          case PREV_KEY:
            index = (index - 1 + targets.length) % targets.length
            targets[index].focus()
            break
          case RIGHT_KEY:
          case NEXT_KEY:
            index = (index + 1) % targets.length
            targets[index].focus()
            break
          default:
            break
        }
      })
    }
  }
}
