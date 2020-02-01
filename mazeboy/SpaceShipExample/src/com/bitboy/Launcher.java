package com.bitboy;

import java.awt.EventQueue;
import javax.swing.JFrame;

public class Launcher extends JFrame {

    /**
	 * http://zetcode.com/tutorials/javagamestutorial/movingsprites/
	 */
	private static final long serialVersionUID = 1L;

	public Launcher() {
        
        initUI();
    }
    
    private void initUI() {

        add(new Board());

        setTitle("Moving sprite");
        setSize(400, 300);
        
        setLocationRelativeTo(null);
        setResizable(false);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    public static void main(String[] args) {

        EventQueue.invokeLater(() -> {
            Launcher ex = new Launcher();
            ex.setVisible(true);
        });
    }
}