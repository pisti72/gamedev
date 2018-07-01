/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package invaders;

import java.awt.EventQueue;
import javax.swing.JFrame;

/**
 *
 * @author istvanszalontai
 */
public class Invaders extends JFrame {

    public Invaders(){
        initUI();
    }
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        //System.out.println("Hello vilag");
        EventQueue.invokeLater(()->{
            Invaders invaders = new Invaders();
            invaders.setVisible(true);
        });
    }

    private void initUI() {
        add(new Board());
        setSize(600,600);
        setTitle("Invaders");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
