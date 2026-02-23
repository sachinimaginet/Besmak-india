import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Contact Information
        </h2>
        <p className="text-gray-600 mb-8">
          Have questions about our products or services? Feel free to reach out
          to our team.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Mail className="h-6 w-6 text-blue-900" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Email</h4>
            <p className="text-gray-600">info@besmakindia.com</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Phone className="h-6 w-6 text-blue-900" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Phone</h4>
            <p className="text-gray-600">+91 123 456 7890</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-blue-900" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Location</h4>
            <p className="text-gray-600">
              123 Industrial Area, Phase II, New Delhi, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
