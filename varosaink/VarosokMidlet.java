/**
 * 
 */

import javax.microedition.lcdui.Display;
import javax.microedition.midlet.MIDlet;
import javax.microedition.midlet.MIDletStateChangeException;

//import com.sun.perseus.model.ImageNode;

/**
 * @author iszalontai & jtabanyi
 *
 */
public final class VarosokMidlet extends MIDlet {

	private static VarosokMidlet INSTANCE;
	protected static final VarosokMidlet getInstance() {
		return INSTANCE;
	}
	
	/**
	 * 
	 */
	public VarosokMidlet() {
		INSTANCE = this;
	}


	/* (non-Javadoc)
	 * @see javax.microedition.midlet.MIDlet#startApp()
	 */
	protected void startApp() throws MIDletStateChangeException {
		// TODO Auto-generated method stub
		VarosokCanvas.getInstance().init();
		Display.getDisplay(this).setCurrent(VarosokCanvas.getInstance());
		VarosokCanvas.getInstance().start();
	}	
	
	
	/* (non-Javadoc)
	 * @see javax.microedition.midlet.MIDlet#destroyApp(boolean)
	 */
	protected void destroyApp(boolean arg0) throws MIDletStateChangeException {
		// TODO Auto-generated method stub
		VarosokCanvas.getInstance().stop();
	}
	
	protected void pauseApp() {

	}


}
