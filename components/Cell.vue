<template>
  <td>
    <v-edit-dialog>
      {{ text }}
      <template #input>
        <v-combobox
          v-model="text"
          :items="items"
          :disabled="disabled"
        />
      </template>
    </v-edit-dialog>
  </td>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    sheetIndex: {
      type: Number,
      default: 0
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    colName: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    text: {
      get () {
        return this.$store.state.sheets[this.sheetIndex].rows[this.rowIndex][this.colName]
      },
      set (newVal) {
        this.edit({
          sheetIndex: this.sheetIndex,
          rowIndex: this.rowIndex,
          colName: this.colName,
          value: newVal
        })
      }
    }
  },
  methods: {
    ...mapActions([
      'edit'
    ])
  }
}
</script>

<style>

</style>
