/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * http://zetcode.com/tutorials/javagamestutorial/spaceinvaders/
 * http://silveiraneto.net/2008/04/27/simple-java-tileset-example/
 */
package invaders;

import java.awt.EventQueue;
import javax.swing.JFrame;

/**
 *
 * @author istvanszalontai
 */
public class Invaders extends JFrame implements Commons {

    public Invaders() {
        initUI();
    }

    private void initUI() {
        add(new Board());
        setTitle("Invaders");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(BOARD_WIDTH, BOARD_HEIGHT);
        setLocationRelativeTo(null);
        setResizable(false);
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        //System.out.println("Hello vilag");
        EventQueue.invokeLater(() -> {
            Invaders invaders = new Invaders();
            invaders.setVisible(true);
        });
    }
}
