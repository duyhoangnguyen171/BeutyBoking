using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BookingSalonHair.Converters
{
    public class DateTimeConverterUsingDateTimeParse : JsonConverter<DateTime>
    {
        private const string DateFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTime.Parse(reader.GetString());
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToUniversalTime().ToString(DateFormat));
        }
    }
}
