import WallFall from './WallFall'
import Data from './Data'

window.onload = function()
{
    if (Data.getCanvasContext())
		new WallFall(Data).run()
}