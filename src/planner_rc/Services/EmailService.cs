using planner.Models;
using System.IO;
using System;
using System.Net.Sockets;
using System.Net.Security;
using Microsoft.Net.Http.Server;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;

namespace planner.Services
{
    public class EmailService
    {
        public static string API_KEY = "*";

        public static string DOMAIN = "*";

        public static async void sendEmailHttpClient(CustomEmail customEmail)
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Basic", Convert.ToBase64String(UTF8Encoding.UTF8.GetBytes("api" + ":" + API_KEY)));

            var form = new Dictionary<string, string>();
            form["from"] = "My Financial Planner <postmaster@sandboxeae6467124b34785b5dd9e682438de43.mailgun.org>";
            form["to"] = customEmail.emailTo;
            form["subject"] = customEmail.subject;
            form["text"] = customEmail.message;

            var  response = await client.PostAsync("https://api.mailgun.net/v3/" + DOMAIN + "/messages", new FormUrlEncodedContent(form));
        }

    public static void sendEmail(CustomEmail customEmail)
        {            
            using (var client = new TcpClient(customEmail.server, customEmail.port))
            {
                using (var stream = client.GetStream())
                using (var reader = new StreamReader(stream))
                using (var writer = new StreamWriter(stream) { AutoFlush = true })
                {
                    Console.WriteLine("1: " + reader.ReadLine() + " ");

                    writer.WriteLine("HELO " + customEmail.server);
                    Console.WriteLine("2: " + reader.ReadLine() + " ");

                    writer.WriteLine("STARTTLS");
                    Console.WriteLine("3: " + reader.ReadLine() + " ");

                    using (var sslStream = new SslStream(client.GetStream(), false))
                    {

                        sslStream.AuthenticateAsClient(customEmail.server);

                        using (var secureReader = new StreamReader(sslStream))
                        using (var secureWriter = new StreamWriter(sslStream) { AutoFlush = true })
                        {

                            secureWriter.WriteLine("AUTH LOGIN");
                            Console.WriteLine("4: " + secureReader.ReadLine() + " ");

                            string username = customEmail.emailFrom;
                            var plainTextBytes1 = System.Text.Encoding.UTF8.GetBytes(username);
                            string base64Username = System.Convert.ToBase64String(plainTextBytes1);
                            secureWriter.WriteLine(base64Username);
                            Console.WriteLine("5: " + secureReader.ReadLine() + " ");

                            string password = customEmail.passwordEmailFrom;
                            var plainTextBytes2 = System.Text.Encoding.UTF8.GetBytes(password);
                            string base64Password = System.Convert.ToBase64String(plainTextBytes2);
                            secureWriter.WriteLine(base64Password);
                            Console.WriteLine("6: " + secureReader.ReadLine() + " ");

                            secureWriter.WriteLine("MAIL FROM:<" + customEmail.emailFrom + ">");
                            Console.WriteLine("7: " + secureReader.ReadLine() + " ");

                            secureWriter.WriteLine("RCPT TO:<" + customEmail.emailTo + ">");
                            Console.WriteLine("8: " + secureReader.ReadLine() + " ");

                            secureWriter.WriteLine("DATA");
                            Console.WriteLine("9: " + secureReader.ReadLine() + " ");

                            secureWriter.WriteLine("From: \"finanncial\"" + customEmail.emailFrom);
                            secureWriter.WriteLine("To: " + customEmail.emailTo);
                            secureWriter.WriteLine("Subject: " + customEmail.subject);
                            secureWriter.WriteLine(customEmail.message);
                            // Leave one blank line after the subject
                            //secureWriter.WriteLine("");
                            // Start the message body here
                            //secureWriter.wWriteLine("1Hello Luke,");
                            //secureWriter.WriteLine("");
                            //secureWriter.WriteLine("2Cuz! You gotta try Beck's Sapphire! It ROCKS!");
                            //secureWriter.WriteLine("");
                            //secureWriter.WriteLine("Later,");
                            //secureWriter.WriteLine("");
                            //secureWriter.WriteLine("Luke");
                            //// End the message body by sending a period
                            secureWriter.WriteLine(".");
                            Console.WriteLine("10: " + secureReader.ReadLine() + " ");

                            secureWriter.WriteLine("QUIT");
                            Console.WriteLine("11: " + secureReader.ReadLine() + " ");
                        }
                    }
                }
            }
        }

    }
}
