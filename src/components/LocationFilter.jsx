'use client';
import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

// বাংলাদেশের বিভাগ, জেলা এবং উপজেলার পূর্ণাঙ্গ ডাটা ম্যাপিং
const bdLocations = {
  "Dhaka": {
    districts: ["Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail"],
    upazilas: {
      "Dhaka": ["Dhamrai", "Dohar", "Keraniganj", "Nawabganj", "Savar", "Tejgaon", "Gulshan", "Mirpur"],
      "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj"],
      "Narayanganj": ["Narayanganj Sadar", "Bandar", "Rupganj", "Sonargaon", "Araihazar"],
      "Tangail": ["Tangail Sadar", "Sakhipur", "Basail", "Madhupur", "Ghatail", "Kalihati", "Nagarpur", "Mirzapur", "Gopalpur", "Dhanbari", "Bhuapur"],
      "Faridpur": ["Faridpur Sadar", "Boalmari", "Bhanga", "Nagarkanda", "Sadarpur", "Alfadanga", "Charbhadrasan", "Madhukhali", "Saltha"],
      "Kishoreganj": ["Kishoreganj Sadar", "Hossainpur", "Pakundia", "Katiadi", "Karimganj", "Tarail", "Itna", "Mithamain", "Austagram", "Bajitpur", "Kuliarchar", "Bhairab"],
      "Manikganj": ["Manikganj Sadar", "Singair", "Shivalaya", "Saturia", "Harirampur", "Ghior", "Daulatpur"],
      "Munshiganj": ["Munshiganj Sadar", "Sreenagar", "Sirajdikhan", "Lohajang", "Tongibari", "Gazaria"],
      "Narsingdi": ["Narsingdi Sadar", "Palash", "Raypura", "Monohardi", "Belabo", "Shibpur"],
      "Rajbari": ["Rajbari Sadar", "Goalundo", "Pangsha", "Baliakandi", "Kalukhali"],
      "Shariatpur": ["Shariatpur Sadar", "Naria", "Zajira", "Gosairhat", "Bhedarganj", "Damudya"],
      "Gopalganj": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Tungipara", "Muksudpur"],
      "Madaripur": ["Madaripur Sadar", "Shibchar", "Kalkini", "Rajoir", "Dasar"]
    }
  },
  "Chattogram": {
    districts: ["Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati"],
    upazilas: {
      "Chattogram": ["Chattogram Sadar", "Boalkhali", "Anwara", "Banshkhali", "Fatikchhari", "Hathazari", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda"],
      "Cumilla": ["Comilla Sadar", "Barura", "Brahmanpara", "Burichong", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Monoharganj", "Meghna", "Titas", "Lalmai"],
      "Brahmanbaria": ["Brahmanbaria Sadar", "Ashuganj", "Nasirnagar", "Nabinagar", "Bancharampur", "Kasba", "Akhaura", "Sarail", "Bijoynagar"],
      "Chandpur": ["Chandpur Sadar", "Haimchar", "Kachua", "Shahrasti", "Faridganj", "Lakshmipur Sadar", "Matlab North", "Matlab South"],
      "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Kutubdia", "Ukhiya", "Pekua", "Ramu", "Teknaf", "Maheshkhali"],
      "Feni": ["Feni Sadar", "Daganbhuiyan", "Chhagalnaiya", "Sonagazi", "Parshuram", "Fulgazi"],
      "Noakhali": ["Noakhali Sadar", "Companiganj", "Begumganj", "Hatia", "Subarnachar", "Kabirhat", "Senbagh", "Chatkhil"],
      "Lakshmipur": ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"],
      "Bandarban": ["Bandarban Sadar", "Ali Kadam", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi", "Lama"],
      "Khagrachhari": ["Khagrachhari Sadar", "Dighinala", "Panchhari", "Laxmichhari", "Mahalchhari", "Manaikchhari", "Ramgarh", "Matiranga", "Guimara"],
      "Rangamati": ["Rangamati Sadar", "Belaichhari", "Bagaichhari", "Barkal", "Juraichhari", "Langadu", "Naniarchar", "Rajsthali", "Kaptai"]
    }
  },
  "Rajshahi": {
    districts: ["Bogura", "Joypurhat", "Naogaon", "Natore", "Chapai Nawabganj", "Pabna", "Rajshahi", "Sirajganj"],
    upazilas: {
      "Rajshahi": ["Rajshahi Sadar", "Bagha", "Baranagar", "Boalia", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"],
      "Bogura": ["Bogura Sadar", "Adamdighi", "Dhunat", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Sherpur", "Shibganj", "Sonatala"],
      "Naogaon": ["Naogaon Sadar", "Atrai", "Badalgachhi", "Manda", "Dhamoirhat", "Mohadevpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
      "Natore": ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra", "Naldanga"],
      "Pabna": ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"],
      "Sirajganj": ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Shahjadpur", "Tarash", "Ullahpara"],
      "Joypurhat": ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
      "Chapai Nawabganj": ["Chapai Nawabganj Sadar", "Gomostapur", "Nachole", "Bholahat", "Shibganj"]
    }
  },
  "Khulna": {
    districts: ["Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"],
    upazilas: {
      "Khulna": ["Khulna Sadar", "Batiaghata", "Dacope", "Dumuria", "Dighalia", "Koyra", "Paikgachha", "Phultala", "Rupsa", "Terokhada"],
      "Jashore": ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
      "Bagerhat": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
      "Chuadanga": ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
      "Jhenaidah": ["Jhenaidah Sadar", "Harinakundu", "Kaliganj", "Kotchandpur", "Shailkupa", "Maheshpur"],
      "Kushtia": ["Kushtia Sadar", "Bheramara", "Kumarkhali", "Khoksa", "Mirpur", "Daulatpur"],
      "Magura": ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
      "Meherpur": ["Meherpur Sadar", "Gangni", "Mujibnagar"],
      "Narail": ["Narail Sadar", "Lohagara", "Kalia"],
      "Satkhira": ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"]
    }
  },
  "Barishal": {
    districts: ["Barguna", "Barishal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
    upazilas: {
      "Barishal": ["Barishal Sadar", "Bakerganj", "Babuganj", "Wazirpur", "Banaripara", "Gournadi", "Agailjhara", "Mehendiganj", "Muladi", "Hizla"],
      "Bhola": ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Tazumuddin", "Manpura"],
      "Jhalokati": ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"],
      "Patuakhali": ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara", "Rangabali", "Dumki"],
      "Pirojpur": ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad"],
      "Barguna": ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltali"]
    }
  },
  "Sylhet": {
    districts: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
    upazilas: {
      "Sylhet": ["Sylhet Sadar", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Zakiganj"],
      "Habiganj": ["Habiganj Sadar", "Ajmiriganj", "Baniachang", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Shayestaganj"],
      "Moulvibazar": ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"],
      "Sunamganj": ["Sunamganj Sadar", "Bishwamvarpur", "Chhatak", "Derai", "Dharamapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Tahirpur", "Madhyanagar"]
    }
  },
  "Rangpur": {
    districts: ["Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"],
    upazilas: {
      "Rangpur": ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"],
      "Dinajpur": ["Dinajpur Sadar", "Birampur", "Birganj", "Bochaganj", "Chirirbandar", "Fullbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
      "Gaibandha": ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
      "Kurigram": ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Phulbari", "Rajarhat", "Rowmari", "Ulipur"],
      "Lalmonirhat": ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"],
      "Nilphamari": ["Nilphamari Sadar", "Jaldhaka", "Kishoreganj", "Dimla", "Domar", "Saidpur"],
      "Panchagarh": ["Panchagarh Sadar", "Boda", "Debiganj", "Atwari", "Tetulia"],
      "Thakurgaon": ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Ranisankail", "Pirganj"]
    }
  },
  "Mymensingh": {
    districts: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
    upazilas: {
      "Mymensingh": ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Nandail", "Trishal", "Muktagachha"],
      "Jamalpur": ["Jamalpur Sadar", "Baksiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"],
      "Netrokona": ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Purbadhala"],
      "Sherpur": ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebordi"]
    }
  }
};

const LocationFilter = ({ 
  selectedDivision, 
  setSelectedDivision, 
  selectedDistrict, 
  setSelectedDistrict, 
  selectedUpazila, 
  setSelectedUpazila 
}) => {
  const districtsList = selectedDivision && bdLocations[selectedDivision] ? bdLocations[selectedDivision].districts : [];
  const upazilasList = (selectedDivision && selectedDistrict && bdLocations[selectedDivision]?.upazilas[selectedDistrict]) 
    ? bdLocations[selectedDivision].upazilas[selectedDistrict] 
    : [];

  return (
    <>
      <div className="relative w-full">
        <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-gray-400 z-10" />
        <select
          value={selectedDivision}
          onChange={(e) => {
            setSelectedDivision(e.target.value);
            setSelectedDistrict('');
            setSelectedUpazila('');
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500 cursor-pointer"
        >
          <option value="">All Divisions</option>
          {Object.keys(bdLocations).map((div, index) => (
            <option key={index} value={div}>{div}</option>
          ))}
        </select>
      </div>

      <div className="relative w-full">
        <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-gray-400 z-10" />
        <select
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedUpazila('');
          }}
          disabled={!selectedDivision}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500 cursor-pointer disabled:opacity-50"
        >
          <option value="">All Districts</option>
          {districtsList.map((dis, index) => (
            <option key={index} value={dis}>{dis}</option>
          ))}
        </select>
      </div>

      <div className="relative w-full">
        <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-gray-400 z-10" />
        <select
          value={selectedUpazila}
          onChange={(e) => setSelectedUpazila(e.target.value)}
          disabled={!selectedDistrict}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-red-500 cursor-pointer disabled:opacity-50"
        >
          <option value="">All Upazilas</option>
          {upazilasList.map((upa, index) => (
            <option key={index} value={upa}>{upa}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default LocationFilter;