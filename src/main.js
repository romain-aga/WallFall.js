import WallFall from './WallFall'
import Data from './Data'

window.onload = function()
{
    Data.init(data => new WallFall(data).run())
}
