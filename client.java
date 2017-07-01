import java.io.*;
import java.util.*;
import java.text.*;
import java.math.*;
import java.util.regex.*;
import java.net.*;

public class client{

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.println("Enter a command or help for a list of commands:");

        while(true){
            System.out.print("> ");
            String s = input.nextLine();// methods should be called with () even if have no argument

            String[] inputArray = s.split("\\s*(,|\\s)\\s*"); //split string on spaces or commas
            //System.out.println(Arrays.toString(inputArray));
            String command = inputArray[0];
            switch(command){
                case "testSites":
                    connect("startTest");
                    System.out.println("Test started.");
                    break;
                case "getStatus":
                    connect("testStatus");
                    System.out.println("Get test Status.");
                    break;
                case "getResults":
                    connect("testResults");
                    System.out.println("Get test Results.");
                    break;
                case "getAll":
                    connect("allTests");
                    System.out.println("Print all test handles.");
                    break;
                case "help":
                    help();
                    break;
                default:
                    System.out.println("Command not found");
            }

        }//close while loop

    }

    public static void help(){
        System.out.println("The following is a list of commands:");
        System.out.println("************************************");
        System.out.println("testSites");
        System.out.println("************************************");
        System.out.println("getStatus");
        System.out.println("************************************");
        System.out.println("getResults");
        System.out.println("************************************");
        System.out.println("getAll");
        System.out.println("************************************");
        System.out.println("help");
        System.out.println("************************************");
        System.out.println("Press Ctrl + C to exit program");
    }

    public static void connect(String command){
        try {
            URL myURL = new URL("http://127.0.0.1:3000/" + command);
            URLConnection myURLConnection = myURL.openConnection();
            myURLConnection.connect();
            System.out.println("Just Connected to :" + myURL);
            BufferedReader in = new BufferedReader(new InputStreamReader(
                                        myURLConnection.getInputStream()));
            String inputLine;
            while ((inputLine = in.readLine()) != null) 
                System.out.println(inputLine);
            in.close();
        } 
        catch (MalformedURLException e) { 
            // new URL() failed
            // ...
        } 
        catch (IOException e) {   
            // openConnection() failed
            // ...
        }
    }

}