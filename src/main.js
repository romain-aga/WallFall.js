window.onload = function()
{
    if (Data.getCanvasContext())
		new WallFall(Data).run()
}