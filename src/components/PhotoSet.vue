<template>
  <div>
    <h1>{{title}}</h1>
    <div class='layout'>
      <div v-for="photo in photoset" :key="photo.id">
        <router-link :to="'/photo/' + photo.id">
          <img v-lazy="photo.url" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// todo: use preventDefault to trap input from remote controller

let createThumbnailUrlList = (photoset) => {
  return photoset.photo.map(photo => ({
    id: photo.id,
    url: photo.url_m
  }))
}

export default {
  name: 'PhotoSet',
  data () {
    return {
      title: null,
      photoset: {}
    }
  },
  mounted () {
    axios
      .get('/service/rest', {
        params: {
          method: 'flickr.photosets.getPhotos',
          photoset_id: this.$route.params.id,
          extras: 'url_m,media'
        }
      })
      .then(response => {
        this.photoset = createThumbnailUrlList(response.data.photoset)
        this.title = response.data.photoset.title
      })
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

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
