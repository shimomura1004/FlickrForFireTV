<template>
  <div class='container'>
    <img v-if="this.type === 'photo'" :src="url" class="media" />
    <video v-else :src="url" controls preload autoplay class="media" />
  </div>
</template>

<script>
import axios from 'axios'
import KeyInputMixin from '@/components/KeyInputMixin'

let find = (arr, label) => {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].label === label) {
      return arr[i]
    }
  }
  return null
}

export default {
  name: 'SinglePage',
  mixins: [KeyInputMixin],
  data () {
    return {
      url: null,
      type: null,
      nextPhotoId: null,
      prevPhotoId: null
    }
  },
  mounted () {
    this.addEventHandlers()
    this.load(this.$route.params.photoset_id, this.$route.params.photo_id)
  },
  destroyed () {
    this.removeEventHandlers()
  },
  beforeRouteUpdate (to, from, next) {
    this.load(to.params.photoset_id, to.params.photo_id)
    next()
  },
  methods: {
    load (photosetId, photoId) {
      axios
        .get('/service/rest', {
          params: {
            method: 'flickr.photos.getSizes',
            photo_id: photoId
          }
        })
        .then(response => {
          // todo: remove hard coded photo size
          var sizeArray = response.data.sizes.size
          let video = find(sizeArray, 'HD MP4')
          if (video) {
            this.url = video.source
            this.type = 'video'
          } else {
            let photo = find(sizeArray, 'Large')
            this.url = photo.source
            this.type = 'photo'
          }
        })

      axios
        .get('/service/rest', {
          params: {
            method: 'flickr.photosets.getContext',
            photo_id: photoId,
            photoset_id: photosetId
          }
        })
        .then(response => {
          this.nextPhotoId = response.data.nextphoto.id
          this.prevPhotoId = response.data.prevphoto.id
        })
    },
    onLeftPressed () {
      if (this.prevPhotoId !== 0) {
        this.$router.replace(`/photo/${this.$route.params.photoset_id}/${this.prevPhotoId}`)
      }
    },
    onRightPressed () {
      if (this.nextPhotoId !== 0) {
        this.$router.replace(`/photo/${this.$route.params.photoset_id}/${this.nextPhotoId}`)
      }
    }
  }
}
</script>

<style scoped>
.media {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
