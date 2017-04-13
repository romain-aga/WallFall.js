export default class Data
{
	static getCanvasContext()
	{
		if ((Data.canvas = document.getElementById(Data.canvasName))
			&& (Data.context = Data.canvas.getContext('2d')))
		{
			Data.canvas.width = Data.width
			Data.canvas.height = Data.height
			return true
		}
		alert(! Data.canvas
			? "Impossible de récupérer le canvas"
			: "Impossible de récupérer le context du canvas"
		)
		return false
	}
}
Data.canvasName = "WallFallCanvas"
Data.width = 700
Data.height = 700