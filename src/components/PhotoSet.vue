<template>
  <div>
    <h1>{{title}}</h1>
    <div class='layout'>
      <div v-for="photo in photoset" :key="photo.id" class="aaa">
        <router-link class="photolink" :to="'/photo/' + photosetId + '/' + photo.id">
          <img v-lazy="photo.url_m" />
          <div v-if="photo.media === 'video'" class="hoge">
            <img src="../assets/play_icon.png" />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// todo: support page nation

import KeyInputMixin from '@/components/KeyInputMixin'
import FlickrAPI from '@/components/FlickrAPI'

export default {
  name: 'PhotoSet',
  mixins: [KeyInputMixin, FlickrAPI],
  data () {
    return {
      title: null,
      photosetId: null,
      photoset: {},
      index: null,
      photolinks: null
    }
  },
  mounted () {
    this.index = parseInt(this.$route.params.index) || 0
    this.addEventHandlers()

    this.getRequest({
      method: 'flickr.photosets.getPhotos',
      photoset_id: this.$route.params.photoset_id,
      extras: 'url_m,media'
    }).then(response => {
      this.photoset = response.data.photoset.photo
      this.title = response.data.photoset.title
      this.photosetId = this.$route.params.photoset_id
    })
  },
  destroyed () {
    this.removeEventHandlers()
  },
  updated () {
    this.photolinks = document.querySelectorAll('.photolink')
    setTimeout(() => {
      this.photolinks[this.index].focus()
    }, 1000)
  },
  methods: {
    onMouseDown (e) {
      e.stopPropagation()
      e.preventDefault()
      this.$router.push(this.photolinks[this.index].href.split('#')[1])
    },
    onLeftPressed (e) {
      e.stopPropagation()
      e.preventDefault()

      if (this.index === null) {
        this.index = 0
      } else {
        this.index = (this.index - 1 + this.photolinks.length) % this.photolinks.length
      }
      this.photolinks[this.index].focus()
      this.$router.replace(`/photoset/${this.photosetId}/${this.index}`)
    },
    onRightPressed (e) {
      e.stopPropagation()
      e.preventDefault()

      if (this.index === null) {
        this.index = 0
      } else {
        this.index = (this.index + 1) % this.photolinks.length
      }
      this.photolinks[this.index].focus()
      this.$router.replace(`/photoset/${this.photosetId}/${this.index}`)
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}

.layout {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 10px;
  grid-column-gap: 10px;
}

.aaa {
  position: relative;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hoge {
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
