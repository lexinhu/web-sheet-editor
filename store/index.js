export const state = () => ({
  sheets: [
    {
      name: '新学期开课预安排表',
      header: ['年级', '课程名称', '教师', '班级名称', '学分', '周学时', '起止周', '总学时', '课程类别', '课程性质', '学期'],
      rows: [],
      item: {
        周学时: '',
        学分: '',
        学期: '',
        年级: '',
        总学时: '',
        教师: '',
        班级名称: '',
        课程名称: '',
        课程性质: '',
        课程类别: '',
        起止周: ''

      }
    }, {
      name: '实训月预安排表',
      header: ['班级', '实训1', '教师1', '实训2', '教师2', '实训周数'],
      rows: [],
      item: { 班级: '', 实训1: '', 教师1: '', 实训2: '', 教师2: '', 实训周数: '' }
    }
  ],
  summary: {
    name: '统计',
    header: ['教师', '总学时'],
    rows: [],
    item: {
      教师: '',
      总学时: ''
    }
  }
})

export const mutations = {
  clear (state) {
    state.sheets.splice(0, state.sheets.length)
  },
  add (state, sheet) {
    state.sheets.push(sheet)
    this.commit('updateSummary')
  },
  deleteRow (state, payload) { // 删除第i个sheet中的第j行数据
    const { index, idx } = payload
    state.sheets[index].rows.splice(idx, 1)
    this.commit('updateSummary')
  },
  appendRow (state, i) {
    state.sheets[i].rows.push(state.sheets[i].item)
  },
  appendRows (state, sheet) {
    // eslint-disable-next-line no-console
    console.log(sheet)
    state.sheets[sheet.index].rows.push(...sheet.rows)
    this.commit('updateSummary')
  },
  edit (state, payload) {
    const { sheetIndex, rowIndex, colName, value } = payload
    state.sheets[sheetIndex].rows[rowIndex][colName] = value
    this.commit('updateSummary')
  },
  updateSummary (state) {
    state.summary.rows.splice(0, state.summary.rows.length)
    const rows = []
    state.sheets.forEach((sheet) => {
      rows.push(...sheet.rows)
    })

    const items = {}
    rows.forEach((row) => {
      if ('教师' in row) {
        const teacher = row['教师']
        if (teacher !== '') {
          let hours = row['总学时']
          hours = hours === '' ? 0 : parseFloat(hours)
          if (!(teacher in items)) {
            items[teacher] = hours
          } else {
            items[teacher] += hours
          }
        }
      } else if ('教师1' in row) {
        const teacher1 = row['教师1']
        const teacher2 = row['教师2']
        const hours = 27
        if (teacher1 !== '' && teacher2 !== '') {
          // 说明存在两个老师
          if (!(teacher1 in items)) {
            items[teacher1] = hours / 2
          } else {
            items[teacher1] += hours / 2
          }
          if (!(teacher2 in items)) {
            items[teacher2] = hours / 2
          } else {
            items[teacher2] += hours / 2
          }
        } else if (teacher1 !== '' && teacher2 === '') {
          // 说明只存在一个老师
          if (!(teacher1 in items)) {
            items[teacher1] = hours
          } else {
            items[teacher1] += hours
          }
        }
      }
    })
    for (const key in items) {
      state.summary.rows.push({
        教师: key,
        总学时: items[key]
      })
    }
  }
}

export const actions = {
  clear ({ commit }) {
    commit('clear')
  },
  add ({ commit }, sheets) {
    for (const name in sheets) {
      const rows = sheets[name]
      const header = Object.keys(rows[0])
      const item = {}
      header.map((val) => { item[val] = '' })
      commit('add', { name, header, item, rows })
    }
  },
  deleteRow ({ commit }, payload) {
    commit('deleteRow', payload)
  },
  appendRow ({ commit }, i) {
    commit('appendRow', i)
  },
  appendRows ({ commit }, sheet) {
    commit('appendRows', sheet)
  },
  edit ({ commit }, payload) {
    commit('edit', payload)
  },
  updateSummary ({ commit }) {
    commit('updateSummary')
  }
}
