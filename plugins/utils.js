export default ({ $xlsx }, inject) => {
  inject('utils', {
    /**
     * 读取excel文件
     * @param {*} file  文件对象
     */
    readExcel (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        const sheets = {}
        reader.readAsArrayBuffer(file)
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = $xlsx.read(data, { type: 'array' })
          for (const name in workbook.Sheets) {
            const sheetData = $xlsx.utils.sheet_to_json(workbook.Sheets[name], { defval: '' })
            sheets[name] = sheetData
          }
          resolve(sheets)
        }
      })
    },

    /**
     * 生成workbook对象
     *
     * @param {*} sheets 工作表格
     * @return {*} workbook
     */
    genWorkbook (sheets) {
      const workbook = $xlsx.utils.book_new()
      if (Object.prototype.toString.call(sheets) === '[object Object]') {
        sheets = [sheets]
      }
      // eslint-disable-next-line no-console
      console.log(sheets)
      for (const sheet of sheets) {
        // eslint-disable-next-line no-console
        console.log(sheet)
        const { name, rows, header } = sheet
        const worksheet = $xlsx.utils.json_to_sheet(rows, { header })
        $xlsx.utils.book_append_sheet(workbook, worksheet, name)
      }
      return workbook
    }
  })
}
