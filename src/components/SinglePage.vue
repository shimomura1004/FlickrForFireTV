<template>
  <div class='container'>
    <img :src="url" />
  </div>
</template>

<script>
import axios from 'axios'

let createPhotoUrl = (photo) => `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`

export default {
  name: 'SinglePage',
  data () {
    return {
      url: null
    }
  },
  mounted () {
    axios
      .get('/service/rest', {
        params: {
          method: 'flickr.photos.getInfo',
          photo_id: this.$route.params.id
        }
      })
      .then(response => {
        var photo = response.data.photo
        this.url = createPhotoUrl(photo)
      })
  }
}
</script>

<style scoped>
img {
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
