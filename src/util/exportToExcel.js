import FileSaver from "file-saver"
import * as XLSX from "xlsx"

export async function exportExcel(data,fileName)
{
	
	/*let aoaList = [['生效日期','类型','单号','订单编号','客订单号','规格','送货数','金额']]
	await data.forEach((item,idx)=>{
		aoaList.push([item.IssueDate,item.CTypeName,item.DNStr,item.strOrderId,item.CusPoNo,item.GuiGe,item.DeliQty,item.Amount])
	})
	let worksheet
	await (worksheet = XLSX.utils.aoa_to_sheet(aoaList))
	let workBook = XLSX.utils.book_new()
	await XLSX.utils.book_append_sheet(workBook,worksheet,'对账单明细')
	await XLSX.writeFile(workBook, fileName + '.xlsx')*/
	let aoaList = [['生效日期','类型','单号','订单编号','客订单号','规格','送货数','金额']]
	await data.forEach((item,idx)=>{
		aoaList.push([item.IssueDate,item.CTypeName,item.DNStr,item.strOrderId,item.CusPoNo,item.GuiGe,item.DeliQty,item.Amount])
	})
	let worksheet
	await (worksheet = XLSX.utils.aoa_to_sheet(aoaList))
	var workBook = XLSX.utils.book_new()
	await XLSX.utils.book_append_sheet(workBook,worksheet,'对账单明细')
	const workbookBlob = workbook2blob(workBook)
	openDownloadDialog(workbookBlob, fileName + ".xlsx")

	function workbook2blob(workbook){
		var wopts = {
			bookType: "xlsx",
			bookSST: false,
			type: "binary",
		}

		var wbout = XLSX.write(workbook, wopts)

		function s2ab(s){
			var buf = new ArrayBuffer(s.length)
		    var view = new Uint8Array(buf)
		    for(var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
		    return buf
		}

		let buf = s2ab(wbout)
		var blob = new Blob([buf], {
			type: "application/octet-stream",
		})

		return blob
	}

	function  openDownloadDialog(blob, fileName){
		if(typeof blob === "object" && blob instanceof Blob) {
			 blob = URL.createObjectURL(blob)
		}
		var aLink = document.createElement("a")
		aLink.href = blob
		aLink.download = fileName || ""
		var event

		if(window.MouseEvent){
			event = new MouseEvent("click")
		} else {
			event = document.createEvent("MouseEvents")
			event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		}
		aLink.dispatchEvent(event)
	}
}
