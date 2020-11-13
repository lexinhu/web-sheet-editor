<template>
  <v-container fluid>
    <h1>Web sheet editor</h1>
    <template v-if="sheets.length !== 0">
      <template v-for="(data, idx) in sheets">
        <sheet :key="idx" :data="data" :index="idx" />
      </template>

      <v-card>
        <v-card-title>
          {{ summary.name }}
        </v-card-title>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th>教师</th>
                <th>总学时</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in summary.rows" :key="idx">
                <td>{{ row['教师'] }}</td>
                <td>{{ row['总学时'] }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </template>
    <v-speed-dial
      v-model="fab"
      fixed
      bottom
      right
      open-on-hover
      direction="left"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="blue darken-2"
          dark
          fab
        >
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-hand-right
          </v-icon>
        </v-btn>
      </template>

      <v-tooltip top>
        <input ref="fileUpload" accept=".xlsx, .xls" type="file" hidden @change="getFileData">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="warning"
            v-bind="attrs"
            small
            fab
            v-on="on"
            @click="upload"
          >
            <v-icon>
              mdi-upload
            </v-icon>
          </v-btn>
        </template>
        <span>导入excel数据</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="success"
            v-bind="attrs"
            small
            fab
            v-on="on"
            @click="download"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </template>
        <span>下载数据</span>
      </v-tooltip>
    </v-speed-dial>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    fab: false
  }),
  computed: {
    sheets () {
      return this.$store.state.sheets
    },
    summary () {
      return this.$store.state.summary
    }
  },
  methods: {
    upload () {
      this.$refs.fileUpload.click()
    },
    getFileData (ev) {
      const file = ev.target.files[0]
      this.$utils.readExcel(file).then((sheets) => {
        this.add(sheets)
      })
    },
    download () {
      const workbook = this.$utils.genWorkbook([...this.sheets, this.summary])
      this.$xlsx.writeFile(workbook, 'output.xlsx')
    },
    ...mapActions([
      'add'
    ])
  }
}
</script>

<style>

</style>
