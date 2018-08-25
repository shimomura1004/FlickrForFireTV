<template>
  <div>
    <div class='layout'>
      <div v-for="album in albums" :key="album.id">
        <router-link class="photolink" :to="'/photoset/' + album.id">
          <figure>
            <img v-lazy="album.primary_photo_extras.url_m" />
            <figcaption>{{album.title._content}}</figcaption>
          </figure>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// todo: display number of pics/videos

import axios from 'axios'

export default {
  name: 'PhotoStream',
  data () {
    return {
      albums: []
    }
  },
  mounted () {
    axios
      .get('/service/rest', {
        params: {
          method: 'flickr.photosets.getList',
          primary_photo_extras: 'url_m'
        }
      })
      .then(response => {
        this.albums = response.data.photosets.photoset
      })
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
  bottom: 0.5em;
  color: #fff;
  margin: 0px;
  padding: 5px 0 5px 3%;
  width: 97%;
  background: #000;
  filter: Alpha(opacity=70);
  opacity: 0.7;
}
</style>
