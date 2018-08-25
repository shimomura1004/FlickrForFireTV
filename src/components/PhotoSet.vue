<template>
  <div>
    <h1>{{title}}</h1>
    <div class='layout'>
      <div v-for="photo in photoset" :key="photo.id" class="aaa">
        <router-link class="photolink" :to="'/photo/' + photo.id">
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
// todo: display video player mark

import axios from 'axios'
import KeyInputMixin from '@/components/KeyInputMixin'

export default {
  name: 'PhotoSet',
  mixins: [KeyInputMixin],
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
        this.photoset = response.data.photoset.photo
        this.title = response.data.photoset.title
        this.addKeyEventHandlers('.photolink')
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
