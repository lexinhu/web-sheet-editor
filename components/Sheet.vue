<template>
  <v-container fluid>
    <div class="d-flex flex-column mb-6">
      <v-card>
        <v-card-title class="headline">
          {{ data.name }}
        </v-card-title>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th v-for="(v, k) in data.header" :key="k">
                  {{ v }}
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in data.rows" :key="idx">
                <template v-for="(v, k, i) in row">
                  <Cell
                    :key="i"
                    :sheet-index="index"
                    :row-index="idx"
                    :col-name="k"
                    :items="getItems(data.rows, item => item[k])"
                    :disabled="disabled"
                  />
                </template>
                <td>
                  <v-btn
                    color="primary"
                    elevation="3"
                    @click="deleteRow({index, idx})"
                  >
                    <v-icon left>
                      mdi-delete
                    </v-icon>
                    删除
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-card-actions>
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="success"
                dark
                v-bind="attrs"
                class="mr-4"
                v-on="on"
                @click="appendRow(index)"
              >
                <v-icon left>
                  mdi-plus
                </v-icon>
                添加
              </v-btn>
            </template>
            <span>添加一行</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-4"
                color="secondary"
                dark
                v-bind="attrs"
                v-on="on"
                @click="download"
              >
                <v-icon left>
                  mdi-download
                </v-icon>
                导出
              </v-btn>
            </template>
            <span>导出为excel</span>
          </v-tooltip>

          <v-tooltip bottom>
            <input ref="fileUpload" accept=".xlsx, .xls" type="file" hidden @change="getFileData">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-4"
                color="warning"
                v-bind="attrs"
                v-on="on"
                @click.prevent="upload"
              >
                <v-icon>
                  mdi-upload
                </v-icon>
                导入
              </v-btn>
            </template>
            <span>导入excel数据</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getItems (rows, callback) {
      return [...new Set(rows.map(callback))].flat().filter(Boolean)
    },
    download () {
      const workbook = this.$utils.genWorkbook(this.data)
      this.$xlsx.writeFile(workbook, `${this.data.name}.xlsx`)
    },
    upload () {
      this.$refs.fileUpload.click()
    },
    getFileData (ev) {
      const file = ev.target.files[0]
      this.$utils.readExcel(file).then((sheets) => {
        const sheet = {
          index: this.index,
          rows: sheets[this.data.name]
        }
        this.appendRows(sheet)
      })
    },
    ...mapActions([
      'deleteRow',
      'appendRow',
      'appendRows'
    ])
  }
}
</script>

<style>

</style>
