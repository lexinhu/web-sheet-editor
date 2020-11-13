<template>
  <v-container fluid>
    {{ sheets }}
    <input ref="fileUpload" accept=".xlsx, .xls" type="file" hidden @change="getFile">
    <v-btn @click="upload">
      <v-icon left>
        mdi-upload
      </v-icon>
      上传
    </v-btn>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  computed: {
    sheets () {
      return this.$store.state.sheets
    }
  },
  created () {
    // eslint-disable-next-line no-console
    console.log(this.$store.state.sheets)
  },
  methods: {
    upload () {
      this.$refs.fileUpload.click()
    },
    getFile (ev) {
      const file = ev.target.files[0]
      this.$utils.readExcel(file).then((sheets) => {
        this.add(sheets)
      })
    },
    ...mapActions([
      'add'
    ])
  }
}
</script>

<style>

</style>
