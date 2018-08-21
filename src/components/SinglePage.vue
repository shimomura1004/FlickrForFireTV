<template>
  <div class='container'>
    <img v-if="this.type === 'photo'" :src="url" class="media" />
    <video v-else :src="url" controls preload class="media" />
  </div>
</template>

<script>
import axios from 'axios'

let find = (arr, label) => {
  for (var i=0; i < arr.length; i++) {
    if (arr[i].label === label) {
      return arr[i]
    }
  }
  return null
}

export default {
  name: 'SinglePage',
  data () {
    return {
      url: null,
      type: null
    }
  },
  mounted () {
    axios
      .get('/service/rest', {
        params: {
          method: 'flickr.photos.getSizes',
          photo_id: this.$route.params.id
        }
      })
      .then(response => {
        var sizeArray = response.data.sizes.size
        console.log(sizeArray)
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
