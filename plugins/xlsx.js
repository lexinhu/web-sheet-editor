import XLSX from 'xlsx'

export default (ctx, inject) => {
  inject('xlsx', XLSX)
}
