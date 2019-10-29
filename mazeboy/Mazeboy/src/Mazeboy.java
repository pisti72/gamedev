import java.awt.*;
import java.awt.event.*;
import java.awt.image.*;
import java.io.*;
import javax.imageio.*;
import javax.swing.*;
 
/**
 * This class demonstrates how to load an Image from an external file
 */
public class Mazeboy extends Component{
           
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	BufferedImage img;
 
    public void paint(Graphics g) {
        g.drawImage(img, 20, 10, null);
    }
 
    public Mazeboy(){
       try {
           img = ImageIO.read(new File("src/mandel.gif"));
       } catch (IOException e) {
       }
 
    }	
 
 
    public static void main(String[] args) {
 
        JFrame f = new JFrame("Load Image Sample");
             
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.add(new Mazeboy());
        f.setSize(400,400);
        f.setVisible(true);
    }
}