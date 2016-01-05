namespace planner.Models
{
    public class CustomEmail
    {
        public string passwordEmailFrom { get; set; }
        public string emailFrom { get; set; }
        public string emailTo { get; set; }
        public string server { get; set; }

        public string message { get; set; }
        public string subject { get; set; }
        public int port { get; set; }
    }
}
