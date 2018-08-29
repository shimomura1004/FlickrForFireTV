<template>
  <div>
    <div class='layout'>
      <div v-for="album in albums" :key="album.id">
        <router-link class="photolink" :to="'/photoset/' + album.id">
          <figure>
            <img v-lazy="album.primary_photo_extras.url_m" />
            <figcaption>
              <p class="title">{{album.title._content}}</p>
              <a class="description">{{album.photos}} photos / {{album.videos}} videos</a>
            </figcaption>
          </figure>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import KeyInputMixin from '@/components/KeyInputMixin'
import FlickrAPI from '@/components/FlickrAPI'

export default {
  name: 'PhotoStream',
  mixins: [KeyInputMixin, FlickrAPI],
  data () {
    return {
      albums: [],
      index: null,
      photolinks: null
    }
  },
  mounted () {
    this.index = parseInt(this.$route.params.index) || 0
    this.addEventHandlers()

    this.getRequest({
      method: 'flickr.photosets.getList',
      primary_photo_extras: 'url_m'
    }).then(response => {
      this.albums = response.data.photosets.photoset
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
      this.$router.replace(`/${this.index}`)
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
      this.$router.replace(`/${this.index}`)
    }
  }
}
</script>

<style scoped>
.layout {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 10px;
  grid-column-gap: 10px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

figure {
  margin: 0px;
  width: 100%;
  height: 100%;
  position: relative;
}

figcaption {
  position: absolute;
  left: 0px;
  bottom: 0em;
  color: #fff;
  margin: 0px;
  padding: 5px 0 5px 0;
  width: 100%;
  background: #000;
  filter: Alpha(opacity=70);
  opacity: 0.7;
}

.title {
  margin: 0px;
}
.description {
  font-size: 0.8em;
}
</style>
