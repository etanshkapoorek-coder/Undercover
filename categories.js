/**
 * categories.js — all word pairs for UNDERCOVER.
 *
 * Each line is "Word A / Word B". One of them becomes the majority word and the
 * other the imposter word (which one is random each round). Add new pairs by
 * simply adding a new line to the relevant block. Duplicates (including
 * reversed duplicates like "A / B" and "B / A") are removed automatically.
 *
 * To add a brand-new category: add a block below, add it to the CATEGORIES
 * object at the bottom, and add its [id, name] to CATEGORY_LIST in
 * public/client.js.
 */

function parse(block) {
  return block.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split(' / ').map(s => s.trim()));
}
function dedupe(pairs) {
  const seen = new Set();
  return pairs.filter(([a, b]) => {
    if (!a || !b || a.toLowerCase() === b.toLowerCase()) return false;
    const key = [a, b].map(s => s.toLowerCase()).sort().join('||');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ------------------------------------------------------------------ */
const football = `
Lionel Messi / Neymar Jr.
Cristiano Ronaldo / Robert Lewandowski
Kylian Mbappé / Erling Haaland
Xavi Hernández / Andrés Iniesta
Ronaldinho / Robinho
Pelé / Garrincha
Diego Maradona / Lionel Messi
Thierry Henry / Dennis Bergkamp
Zinedine Zidane / Andrea Pirlo
David Beckham / Steven Gerrard
Sergio Ramos / Gerard Piqué
Luka Modrić / Andrés Iniesta
Karim Benzema / Robert Lewandowski
Eden Hazard / Neymar Jr.
Mesut Özil / David Silva
Patrice Evra / Ashley Cole
Neymar Jr. / Ronaldinho
Kevin De Bruyne / Mesut Özil
Toni Kroos / Luka Modrić
Sergio Busquets / Casemiro
Andrea Pirlo / Xabi Alonso
Paolo Maldini / Franco Baresi
Fabio Cannavaro / Alessandro Nesta
Gianluigi Buffon / Iker Casillas
Manuel Neuer / Marc-André ter Stegen
Thibaut Courtois / Alisson Becker
Virgil van Dijk / Sergio Ramos
Philipp Lahm / Dani Alves
Marcelo / Roberto Carlos
Cafu / Dani Alves
Wayne Rooney / Zlatan Ibrahimović
Zlatan Ibrahimović / Samuel Eto'o
Didier Drogba / Samuel Eto'o
Mohamed Salah / Sadio Mané
Sadio Mané / Riyad Mahrez
Harry Kane / Luis Suárez
Luis Suárez / Edinson Cavani
Sergio Agüero / Carlos Tevez
Gonzalo Higuaín / Sergio Agüero
Ángel Di María / Arjen Robben
Arjen Robben / Franck Ribéry
Gareth Bale / Cristiano Ronaldo
Gareth Bale / Ryan Giggs
Ryan Giggs / Paul Scholes
Paul Scholes / Steven Gerrard
Frank Lampard / Steven Gerrard
John Terry / Rio Ferdinand
Rio Ferdinand / Nemanja Vidić
Vincent Kompany / Virgil van Dijk
Raphaël Varane / Pepe
Antoine Griezmann / Karim Benzema
Paulo Dybala / Lionel Messi
Roberto Baggio / Francesco Totti
Francesco Totti / Alessandro Del Piero
Johan Cruyff / Franz Beckenbauer
Ronaldo Nazário / Romário
Romário / Bebeto
Ronaldo Nazário / Cristiano Ronaldo
Kaká / Ronaldinho
Kaká / Rivaldo
Rivaldo / Ronaldinho
Frenkie de Jong / Pedri
Pedri / Gavi
Jude Bellingham / Declan Rice
Bukayo Saka / Phil Foden
Vinícius Júnior / Rodrygo
Erling Haaland / Harry Kane
Kylian Mbappé / Vinícius Júnior
Thierry Henry / Ruud van Nistelrooy
Ruud van Nistelrooy / Raúl
Raúl / Fernando Torres
David Villa / Fernando Torres
Cesc Fàbregas / Xavi Hernández
Carles Puyol / Gerard Piqué
Víctor Valdés / Iker Casillas
Peter Schmeichel / Edwin van der Sar
Roy Keane / Patrick Vieira
Patrick Vieira / Claude Makélélé
N'Golo Kanté / Casemiro
Michael Essien / Yaya Touré
Yaya Touré / Michael Ballack
Eden Hazard / Kevin De Bruyne
Thomas Müller / Miroslav Klose
Bastian Schweinsteiger / Xabi Alonso
Zinedine Zidane / Michel Platini
Michel Platini / Diego Maradona
Lothar Matthäus / Franz Beckenbauer
Sunil Chhetri / Bhaichung Bhutia
Son Heung-min / Mohamed Salah
Alexis Sánchez / Arturo Vidal
Diego Costa / Luis Suárez
Cristiano Ronaldo / Zlatan Ibrahimović
Lionel Messi / Cristiano Ronaldo
Luka Modrić / Toni Kroos
Sergio Ramos / Pepe
Dani Alves / Marcelo
Roberto Firmino / Karim Benzema
Mohamed Salah / Eden Hazard
Bernardo Silva / David Silva
Rúben Dias / Virgil van Dijk
Trent Alexander-Arnold / Dani Alves
Andrew Robertson / Marcelo
Jordi Alba / Marcelo
Gerard Piqué / Sergio Ramos
Neymar Jr. / Kylian Mbappé
`;

/* ------------------------------------------------------------------ */
const bollywood = `
Shah Rukh Khan / Aamir Khan
Salman Khan / Akshay Kumar
Ranbir Kapoor / Ranveer Singh
Amitabh Bachchan / Dharmendra
Priyanka Chopra / Deepika Padukone
Kareena Kapoor / Katrina Kaif
Hrithik Roshan / Tiger Shroff
Alia Bhatt / Kiara Advani
Vicky Kaushal / Ayushmann Khurrana
Shahid Kapoor / Ranbir Kapoor
Ranveer Singh / Varun Dhawan
Hrithik Roshan / Shah Rukh Khan
Akshay Kumar / Ajay Devgn
Emraan Hashmi / John Abraham
Shah Rukh Khan / Salman Khan
Aamir Khan / Akshay Kumar
Saif Ali Khan / Abhishek Bachchan
Abhishek Bachchan / Bobby Deol
Sunny Deol / Sanjay Dutt
Sunil Shetty / Akshay Kumar
Govinda / Anil Kapoor
Anil Kapoor / Jackie Shroff
Jackie Shroff / Sanjay Dutt
Rajesh Khanna / Amitabh Bachchan
Dilip Kumar / Raj Kapoor
Dev Anand / Shammi Kapoor
Shatrughan Sinha / Vinod Khanna
Mithun Chakraborty / Jeetendra
Rishi Kapoor / Rajesh Khanna
Sidharth Malhotra / Varun Dhawan
Tiger Shroff / Vidyut Jammwal
Kartik Aaryan / Ayushmann Khurrana
Rajkummar Rao / Nawazuddin Siddiqui
Nawazuddin Siddiqui / Irrfan Khan
Irrfan Khan / Manoj Bajpayee
Pankaj Tripathi / Manoj Bajpayee
Vicky Kaushal / Rajkummar Rao
Kunal Khemu / Arshad Warsi
Arshad Warsi / Boman Irani
Paresh Rawal / Anupam Kher
Kay Kay Menon / Randeep Hooda
Sidharth Malhotra / Shahid Kapoor
Arjun Kapoor / Ranveer Singh
Farhan Akhtar / Hrithik Roshan
Abhay Deol / Farhan Akhtar
Salman Khan / Sanjay Dutt
Aamir Khan / R. Madhavan
R. Madhavan / Saif Ali Khan
Deepika Padukone / Anushka Sharma
Anushka Sharma / Katrina Kaif
Priyanka Chopra / Kangana Ranaut
Kangana Ranaut / Vidya Balan
Vidya Balan / Konkona Sen Sharma
Rani Mukerji / Kajol
Kajol / Madhuri Dixit
Madhuri Dixit / Sridevi
Sridevi / Juhi Chawla
Aishwarya Rai Bachchan / Sushmita Sen
Sushmita Sen / Lara Dutta
Karisma Kapoor / Kareena Kapoor
Kareena Kapoor / Priyanka Chopra
Preity Zinta / Rani Mukerji
Shraddha Kapoor / Alia Bhatt
Sara Ali Khan / Janhvi Kapoor
Janhvi Kapoor / Ananya Panday
Kriti Sanon / Shraddha Kapoor
Taapsee Pannu / Bhumi Pednekar
Bhumi Pednekar / Yami Gautam
Parineeti Chopra / Sonakshi Sinha
Sonam Kapoor / Sonakshi Sinha
Jacqueline Fernandez / Nora Fatehi
Disha Patani / Kriti Sanon
Hema Malini / Rekha
Rekha / Zeenat Aman
Waheeda Rehman / Nargis
Mumtaz / Helen
Shah Rukh Khan / Akshay Kumar
Salman Khan / Aamir Khan
Ranbir Kapoor / Hrithik Roshan
Ranveer Singh / Ranbir Kapoor
Varun Dhawan / Tiger Shroff
Ajay Devgn / Sunil Shetty
Sanjay Dutt / Sunny Deol
Amitabh Bachchan / Dilip Kumar
Alia Bhatt / Deepika Padukone
Katrina Kaif / Deepika Padukone
Anil Kapoor / Govinda
Rajpal Yadav / Johnny Lever
Johnny Lever / Paresh Rawal
Ranbir Kapoor / Sidharth Malhotra
`;

/* ------------------------------------------------------------------ */
const hollywood = `
Leonardo DiCaprio / Brad Pitt
Tom Cruise / Tom Hanks
Robert Downey Jr. / Chris Evans
Dwayne Johnson / Jason Statham
Will Smith / Denzel Washington
Scarlett Johansson / Jennifer Lawrence
Johnny Depp / Christian Bale
Ryan Reynolds / Ryan Gosling
Margot Robbie / Emma Stone
Matt Damon / Ben Affleck
Tom Hardy / Christian Bale
Robert Pattinson / Timothée Chalamet
Timothée Chalamet / Tom Holland
Tom Holland / Tobey Maguire
Tobey Maguire / Andrew Garfield
Chris Hemsworth / Chris Pratt
Chris Evans / Chris Pine
Chris Pine / Chris Hemsworth
Ryan Gosling / Bradley Cooper
Bradley Cooper / Jake Gyllenhaal
Jake Gyllenhaal / Joaquin Phoenix
Joaquin Phoenix / Christian Bale
Michael Fassbender / Tom Hardy
Daniel Craig / Pierce Brosnan
Sean Connery / Roger Moore
Hugh Jackman / Russell Crowe
Russell Crowe / Gerard Butler
Gerard Butler / Jason Statham
Vin Diesel / Dwayne Johnson
Paul Walker / Vin Diesel
Keanu Reeves / Nicolas Cage
Nicolas Cage / Johnny Depp
Al Pacino / Robert De Niro
Robert De Niro / Marlon Brando
Jack Nicholson / Anthony Hopkins
Anthony Hopkins / Morgan Freeman
Morgan Freeman / Samuel L. Jackson
Samuel L. Jackson / Denzel Washington
Eddie Murphy / Kevin Hart
Kevin Hart / Dwayne Johnson
Adam Sandler / Ben Stiller
Ben Stiller / Jim Carrey
Jim Carrey / Robin Williams
Will Ferrell / Steve Carell
Jonah Hill / Seth Rogen
Mark Wahlberg / Matt Damon
Sylvester Stallone / Arnold Schwarzenegger
Bruce Willis / Harrison Ford
Harrison Ford / Kurt Russell
Clint Eastwood / John Wayne
Tom Cruise / Brad Pitt
George Clooney / Brad Pitt
George Clooney / Matthew McConaughey
Matthew McConaughey / Woody Harrelson
Emma Watson / Emma Stone
Jennifer Lawrence / Emma Stone
Anne Hathaway / Natalie Portman
Natalie Portman / Keira Knightley
Keira Knightley / Kate Winslet
Kate Winslet / Cate Blanchett
Cate Blanchett / Meryl Streep
Meryl Streep / Julia Roberts
Julia Roberts / Sandra Bullock
Sandra Bullock / Jennifer Aniston
Jennifer Aniston / Courteney Cox
Angelina Jolie / Charlize Theron
Charlize Theron / Nicole Kidman
Nicole Kidman / Reese Witherspoon
Margot Robbie / Ana de Armas
Zendaya / Florence Pugh
Florence Pugh / Anya Taylor-Joy
Gal Gadot / Brie Larson
Brie Larson / Scarlett Johansson
Zoe Saldaña / Gal Gadot
Halle Berry / Zoe Saldaña
Viola Davis / Octavia Spencer
Daniel Radcliffe / Elijah Wood
Orlando Bloom / Viggo Mortensen
Johnny Depp / Orlando Bloom
Henry Cavill / Chris Hemsworth
Henry Cavill / Ben Affleck
Ben Affleck / Christian Bale
Mark Ruffalo / Jeremy Renner
Jeremy Renner / Chris Evans
Paul Rudd / Ryan Reynolds
Dev Patel / Riz Ahmed
Pedro Pascal / Oscar Isaac
Oscar Isaac / Adam Driver
Adam Driver / Michael B. Jordan
Michael B. Jordan / Idris Elba
Idris Elba / Denzel Washington
Leonardo DiCaprio / Joaquin Phoenix
Leonardo DiCaprio / Matt Damon
Brad Pitt / George Clooney
Tom Hanks / Tom Cruise
Robert Downey Jr. / Johnny Depp
Scarlett Johansson / Emma Stone
`;

/* ------------------------------------------------------------------ */
const music = `
Michael Jackson / Prince
Beyoncé / Rihanna
Ariana Grande / Selena Gomez
Taylor Swift / Katy Perry
Drake / Kanye West
Ed Sheeran / Shawn Mendes
Adele / Sam Smith
Freddie Mercury / Robert Plant
Justin Bieber / Shawn Mendes
Justin Timberlake / Bruno Mars
Bruno Mars / The Weeknd
The Weeknd / Drake
Drake / Travis Scott
Kendrick Lamar / J. Cole
Eminem / 50 Cent
Jay-Z / Kanye West
Jay-Z / Nas
Snoop Dogg / Dr. Dre
Tupac Shakur / The Notorious B.I.G.
Post Malone / Travis Scott
Billie Eilish / Lorde
Lorde / Lana Del Rey
Dua Lipa / Ariana Grande
Dua Lipa / Doja Cat
Doja Cat / Nicki Minaj
Nicki Minaj / Cardi B
Cardi B / Megan Thee Stallion
Rihanna / Lady Gaga
Lady Gaga / Madonna
Madonna / Britney Spears
Britney Spears / Christina Aguilera
Christina Aguilera / Mariah Carey
Mariah Carey / Whitney Houston
Celine Dion / Whitney Houston
Shakira / Jennifer Lopez
Jennifer Lopez / Beyoncé
Selena Gomez / Demi Lovato
Miley Cyrus / Taylor Swift
Olivia Rodrigo / Taylor Swift
Harry Styles / Zayn Malik
Harry Styles / Shawn Mendes
Chris Martin / Bono
Bono / Freddie Mercury
Mick Jagger / Robert Plant
Mick Jagger / David Bowie
David Bowie / Elton John
Elton John / Billy Joel
Paul McCartney / John Lennon
John Lennon / Bob Dylan
Bob Dylan / Bruce Springsteen
Elvis Presley / Frank Sinatra
Frank Sinatra / Dean Martin
Eric Clapton / Jimi Hendrix
Jimi Hendrix / Jimmy Page
Kurt Cobain / Eddie Vedder
Axl Rose / Steven Tyler
Ozzy Osbourne / Bruce Dickinson
Chester Bennington / Kurt Cobain
Michael Jackson / Justin Timberlake
Usher / Chris Brown
Chris Brown / Ne-Yo
Rihanna / Nicki Minaj
Adele / Amy Winehouse
Amy Winehouse / Lana Del Rey
Sia / Katy Perry
Katy Perry / Lady Gaga
A. R. Rahman / Pritam
Arijit Singh / Atif Aslam
Sonu Nigam / Kumar Sanu
Shreya Ghoshal / Sunidhi Chauhan
Lata Mangeshkar / Asha Bhosle
Mohammed Rafi / Kishore Kumar
Neha Kakkar / Shreya Ghoshal
Badshah / Yo Yo Honey Singh
Diljit Dosanjh / Guru Randhawa
Jubin Nautiyal / Arijit Singh
Mika Singh / Daler Mehndi
Armaan Malik / Atif Aslam
Eminem / Kendrick Lamar
Travis Scott / Kanye West
Michael Jackson / Elvis Presley
Beyoncé / Taylor Swift
Billie Eilish / Olivia Rodrigo
Bad Bunny / J Balvin
Shakira / Rihanna
Ed Sheeran / Justin Bieber
Sam Smith / Harry Styles
Arijit Singh / Sonu Nigam
Pritam / Amit Trivedi
Vishal-Shekhar / Shankar-Ehsaan-Loy
Yo Yo Honey Singh / Mika Singh
`;

/* ------------------------------------------------------------------ */
const indianPolitics = `
Jawaharlal Nehru / Lal Bahadur Shastri
Indira Gandhi / Sonia Gandhi
Atal Bihari Vajpayee / L. K. Advani
Narendra Modi / Amit Shah
Rahul Gandhi / Priyanka Gandhi Vadra
Mamata Banerjee / Jayalalithaa
Arvind Kejriwal / Manish Sisodia
Manmohan Singh / P. V. Narasimha Rao
Sardar Vallabhbhai Patel / Jawaharlal Nehru
Subhas Chandra Bose / Bhagat Singh
Mahatma Gandhi / Jawaharlal Nehru
B. R. Ambedkar / Mahatma Gandhi
Rajiv Gandhi / Indira Gandhi
Sonia Gandhi / Rahul Gandhi
Narendra Modi / Atal Bihari Vajpayee
Amit Shah / Rajnath Singh
Rajnath Singh / L. K. Advani
Nitin Gadkari / Rajnath Singh
Yogi Adityanath / Narendra Modi
Arvind Kejriwal / Mamata Banerjee
Mamata Banerjee / Naveen Patnaik
Naveen Patnaik / Nitish Kumar
Nitish Kumar / Lalu Prasad Yadav
Lalu Prasad Yadav / Mulayam Singh Yadav
Mulayam Singh Yadav / Akhilesh Yadav
Akhilesh Yadav / Tejashwi Yadav
Mayawati / Mamata Banerjee
Mayawati / Kanshi Ram
Sharad Pawar / Uddhav Thackeray
Uddhav Thackeray / Bal Thackeray
Bal Thackeray / Raj Thackeray
Devendra Fadnavis / Eknath Shinde
Ashok Gehlot / Sachin Pilot
Sachin Pilot / Jyotiraditya Scindia
Jyotiraditya Scindia / Rahul Gandhi
Priyanka Gandhi Vadra / Smriti Irani
Smriti Irani / Nirmala Sitharaman
Nirmala Sitharaman / Arun Jaitley
Arun Jaitley / Sushma Swaraj
Sushma Swaraj / Indira Gandhi
Shashi Tharoor / Jairam Ramesh
Asaduddin Owaisi / Sitaram Yechury
M. K. Stalin / M. Karunanidhi
M. Karunanidhi / Jayalalithaa
M. G. Ramachandran / N. T. Rama Rao
Chandrababu Naidu / Y. S. Jagan Mohan Reddy
Y. S. Rajasekhara Reddy / Chandrababu Naidu
K. Chandrashekar Rao / Chandrababu Naidu
Pinarayi Vijayan / V. S. Achuthanandan
Himanta Biswa Sarma / Yogi Adityanath
Manohar Parrikar / Arun Jaitley
Pranab Mukherjee / Manmohan Singh
A. P. J. Abdul Kalam / Sarvepalli Radhakrishnan
Morarji Desai / Charan Singh
Chandra Shekhar / V. P. Singh
H. D. Deve Gowda / I. K. Gujral
Atal Bihari Vajpayee / Manmohan Singh
Rahul Gandhi / Arvind Kejriwal
Narendra Modi / Rahul Gandhi
Bhagat Singh / Chandra Shekhar Azad
Lal Bahadur Shastri / Morarji Desai
`;

/* ------------------------------------------------------------------ */
const influential = `
Elon Musk / Jeff Bezos
Bill Gates / Steve Jobs
Mahatma Gandhi / Nelson Mandela
Martin Luther King Jr. / Malcolm X
Marie Curie / Albert Einstein
Oprah Winfrey / Ellen DeGeneres
Barack Obama / Bill Clinton
Warren Buffett / Charlie Munger
Mark Zuckerberg / Elon Musk
Mark Zuckerberg / Jack Dorsey
Larry Page / Sergey Brin
Sundar Pichai / Satya Nadella
Satya Nadella / Tim Cook
Tim Cook / Steve Jobs
Steve Wozniak / Steve Jobs
Bill Gates / Warren Buffett
Warren Buffett / Jack Ma
Jack Ma / Jeff Bezos
Ratan Tata / Mukesh Ambani
Mukesh Ambani / Gautam Adani
Anand Mahindra / Ratan Tata
Narayana Murthy / Azim Premji
Dhirubhai Ambani / Ratan Tata
Albert Einstein / Stephen Hawking
Stephen Hawking / Isaac Newton
Nikola Tesla / Thomas Edison
Thomas Edison / Alexander Graham Bell
Galileo Galilei / Isaac Newton
Charles Darwin / Gregor Mendel
Sigmund Freud / Carl Jung
Marie Curie / Rosalind Franklin
Malala Yousafzai / Greta Thunberg
Mother Teresa / Princess Diana
Mahatma Gandhi / Martin Luther King Jr.
Nelson Mandela / Desmond Tutu
Dalai Lama / Mother Teresa
Swami Vivekananda / Rabindranath Tagore
Rabindranath Tagore / Mahatma Gandhi
A. P. J. Abdul Kalam / Vikram Sarabhai
Vikram Sarabhai / Homi J. Bhabha
C. V. Raman / Srinivasa Ramanujan
Sachin Tendulkar / Virat Kohli
Oprah Winfrey / Michelle Obama
Michelle Obama / Hillary Clinton
Barack Obama / John F. Kennedy
John F. Kennedy / Abraham Lincoln
Walt Disney / Steve Jobs
Henry Ford / Elon Musk
Sam Altman / Elon Musk
Jensen Huang / Sam Altman
Richard Branson / Elon Musk
Jeff Bezos / Bill Gates
Mark Zuckerberg / Bill Gates
Sundar Pichai / Tim Cook
Kalpana Chawla / Sunita Williams
Neil Armstrong / Yuri Gagarin
Yuri Gagarin / Rakesh Sharma
Muhammad Ali / Mike Tyson
Michael Jordan / LeBron James
Usain Bolt / Carl Lewis
Serena Williams / Venus Williams
Roger Federer / Rafael Nadal
Rafael Nadal / Novak Djokovic
MS Dhoni / Virat Kohli
Sachin Tendulkar / Brian Lara
`;

/* ------------------------------------------------------------------ */
const heroes = `
Iron Man / Batman
Spider-Man / Miles Morales
Superman / Captain Marvel
Wolverine / Deadpool
Thor / Hercules
The Flash / Quicksilver
Black Widow / Hawkeye
Batman / Daredevil
Batman / Black Panther
Iron Man / Doctor Strange
Captain America / Superman
Captain America / Wonder Woman
Wonder Woman / Thor
Thor / Superman
Hulk / Superman
Hulk / The Thing
Aquaman / Namor
Black Panther / Captain America
Spider-Man / Batman
Spider-Man / Daredevil
Spider-Man / Ant-Man
Ant-Man / The Atom
Green Lantern / Doctor Strange
Doctor Strange / Doctor Fate
Deadpool / Joker
Joker / Harley Quinn
Joker / Loki
Loki / Lex Luthor
Thanos / Darkseid
Magneto / Professor X
Professor X / Doctor Strange
Wolverine / Sabretooth
Wolverine / Batman
Cyclops / Captain America
Storm / Wonder Woman
Scarlet Witch / Jean Grey
Scarlet Witch / Doctor Strange
Hawkeye / Green Arrow
Green Arrow / Batman
Black Widow / Catwoman
Catwoman / Batgirl
Shazam / Superman
The Flash / Superman
Krrish / Superman
Shaktimaan / Superman
Krrish / Shaktimaan
Krrish / Spider-Man
Venom / Carnage
Venom / Spider-Man
Ghost Rider / Spawn
Blade / Wolverine
Doctor Doom / Lex Luthor
Iron Man / Spider-Man
Iron Man / Captain America
Batman / Superman
Thor / Hulk
Nightwing / Robin
Robin / Batgirl
Falcon / Winter Soldier
Vision / Ultron
Ant-Man / Wasp
Star-Lord / Rocket Raccoon
Silver Surfer / Superman
`;

/* ------------------------------------------------------------------ */
const food = `
Pizza / Calzone
Sushi / Sashimi
Burger / Sandwich
Tacos / Burritos
Ramen / Udon
Croissant / Danish Pastry
Pasta / Rice Noodles
Samosa / Empanada
Biryani / Pulao
Biryani / Fried Rice
Butter Chicken / Chicken Tikka Masala
Paneer Tikka / Chicken Tikka
Dosa / Uttapam
Idli / Dhokla
Samosa / Kachori
Vada Pav / Burger
Pav Bhaji / Misal Pav
Chole Bhature / Aloo Puri
Naan / Roti
Roti / Paratha
Paratha / Kulcha
Gulab Jamun / Rasgulla
Rasgulla / Rasmalai
Jalebi / Imarti
Kheer / Phirni
Ladoo / Barfi
Halwa / Kheer
Lassi / Chaas
Chai / Coffee
Pani Puri / Bhel Puri
Sev Puri / Dahi Puri
Momos / Dumplings
Spring Roll / Samosa
Hot Dog / Corn Dog
Burger / Hot Dog
Pizza / Flatbread
Pasta / Lasagna
Spaghetti / Fettuccine
Risotto / Paella
Paella / Biryani
Ramen / Pho
Pho / Tom Yum
Sushi / Maki
Tempura / Pakora
Pakora / Bhajiya
Shawarma / Gyro
Falafel / Vada
Kebab / Shawarma
Croissant / Brioche
Donut / Bagel
Pancake / Waffle
Waffle / Crepe
Cupcake / Muffin
Cake / Pastry
Brownie / Cookie
Ice Cream / Gelato
Cheesecake / Tiramisu
Coke / Pepsi
Nachos / Tortilla Chips
Burrito / Quesadilla
Fish and Chips / Fried Fish
Egg Roll / Spring Roll
Mac and Cheese / Alfredo Pasta
French Fries / Potato Wedges
Milkshake / Smoothie
Tea / Green Tea
`;

/* ------------------------------------------------------------------ */
const animals = `
Lion / Tiger
Alligator / Crocodile
Dolphin / Porpoise
Cheetah / Leopard
Frog / Toad
Wolf / Fox
Butterfly / Moth
Camel / Llama
Leopard / Jaguar
Jaguar / Puma
Cheetah / Lion
Panther / Leopard
Wolf / Coyote
Wolf / Husky
Fox / Jackal
Hyena / Wolf
Dog / Wolf
Crow / Raven
Eagle / Hawk
Hawk / Falcon
Owl / Hawk
Pigeon / Dove
Parrot / Macaw
Penguin / Puffin
Ostrich / Emu
Flamingo / Crane
Swan / Goose
Duck / Goose
Elephant / Mammoth
Elephant / Rhinoceros
Rhinoceros / Hippopotamus
Giraffe / Okapi
Zebra / Horse
Horse / Donkey
Donkey / Mule
Llama / Alpaca
Sheep / Goat
Goat / Deer
Deer / Antelope
Bison / Buffalo
Buffalo / Yak
Monkey / Ape
Chimpanzee / Gorilla
Gorilla / Orangutan
Bear / Panda
Polar Bear / Grizzly Bear
Seal / Sea Lion
Whale / Shark
Shark / Dolphin
Orca / Great White Shark
Turtle / Tortoise
Snake / Lizard
Cobra / Python
Crocodile / Komodo Dragon
Salamander / Newt
Bee / Wasp
Ant / Termite
Spider / Scorpion
Rat / Mouse
Squirrel / Chipmunk
Rabbit / Hare
Kangaroo / Wallaby
Koala / Sloth
Octopus / Squid
Lobster / Crab
Crab / Shrimp
Salmon / Trout
`;

/* ------------------------------------------------------------------ */
const history = `
Napoleon Bonaparte / Julius Caesar
Cleopatra / Nefertiti
Abraham Lincoln / George Washington
Leonardo da Vinci / Michelangelo
Genghis Khan / Alexander the Great
Winston Churchill / Franklin D. Roosevelt
Alexander the Great / Julius Caesar
Hannibal / Scipio Africanus
Genghis Khan / Attila the Hun
Attila the Hun / Kublai Khan
Ashoka / Chandragupta Maurya
Akbar / Shah Jahan
Akbar / Ashoka
Aurangzeb / Akbar
Shivaji / Maharana Pratap
Maharana Pratap / Prithviraj Chauhan
Rani Lakshmibai / Joan of Arc
Joan of Arc / Cleopatra
Queen Victoria / Queen Elizabeth I
Queen Elizabeth I / Catherine the Great
Catherine the Great / Peter the Great
Peter the Great / Ivan the Terrible
Louis XIV / Napoleon Bonaparte
Henry VIII / Louis XIV
Julius Caesar / Augustus
Augustus / Nero
Nero / Caligula
Marcus Aurelius / Seneca
Socrates / Plato
Plato / Aristotle
Aristotle / Confucius
Confucius / Buddha
Buddha / Mahavira
Muhammad Ali Jinnah / Mahatma Gandhi
Vladimir Lenin / Karl Marx
Karl Marx / Friedrich Engels
Christopher Columbus / Vasco da Gama
Vasco da Gama / Ferdinand Magellan
Marco Polo / Ibn Battuta
Michelangelo / Raphael
William Shakespeare / Charles Dickens
Charles Dickens / Mark Twain
Mark Twain / Oscar Wilde
Wolfgang Amadeus Mozart / Ludwig van Beethoven
Ludwig van Beethoven / Johann Sebastian Bach
George Washington / Thomas Jefferson
Thomas Jefferson / Benjamin Franklin
Abraham Lincoln / Theodore Roosevelt
Tipu Sultan / Hyder Ali
Tipu Sultan / Shivaji
Mahmud of Ghazni / Muhammad Ghori
Razia Sultana / Nur Jahan
Nefertiti / Hatshepsut
Tutankhamun / Ramses II
Ramses II / Cleopatra
Albert Einstein / Isaac Newton
Marie Curie / Ada Lovelace
Leonardo da Vinci / Galileo Galilei
Bhagat Singh / Subhas Chandra Bose
Rani Lakshmibai / Razia Sultana
`;

/* ------------------------------------------------------------------ */
const CATEGORIES = {
  football:        { name: 'Football (Soccer) Legends', pairs: dedupe(parse(football)) },
  bollywood:       { name: 'Bollywood Actors',          pairs: dedupe(parse(bollywood)) },
  indian_politics: { name: 'Indian Politicians',        pairs: dedupe(parse(indianPolitics)) },
  hollywood:       { name: 'Hollywood Actors',          pairs: dedupe(parse(hollywood)) },
  influential:     { name: 'Influential Figures',       pairs: dedupe(parse(influential)) },
  music:           { name: 'Music Icons',               pairs: dedupe(parse(music)) },
  heroes:          { name: 'Superheroes',               pairs: dedupe(parse(heroes)) },
  food:            { name: 'World Foods',               pairs: dedupe(parse(food)) },
  animals:         { name: 'Wild Animals',              pairs: dedupe(parse(animals)) },
  history:         { name: 'Historical Figures',        pairs: dedupe(parse(history)) },
};

module.exports = CATEGORIES;
