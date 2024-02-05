/**
 * MA1487 matmod
 * Inlämning 3
 */

// TODO: Write your name here
// TODO: Write your acronym here

/*-------------------------------------------------
-------------------------------------------------

-------------------- Svenska -------------------------
Då uppgifterna innehåller kvantiler så ska två decimaler användas,
t.ex. 1.96 för tvåsidigt intervall vid konfidensgrad 95% för normalfördelningen
------------------------------------------------------


When excercise involves quantiles use two decimals,
e.g. 1.96 for two sided 95% confidence of the normal distribution.

-------------------------------------------------
-------------------------------------------------*/

/**
 * -------------------- Svenska -------------------------
 * En webbsida utför ett AB-test för att avgöra vilken UI feature
 * som bäst på att få besökarna att bli betalande kunder.
 * 1000 av besökarna ser standard interfacet (A) och
 * 300 det nya (B).
 * 250 av A och 100 av B blir betalande kunder.
 * Vad är p-värdet för differensen mellan grupperna?
 * ------------------------------------------------------
 *
 * A website is doing a AB-test to figure out which UI feature works best
 * in turning visitors to paying customers.
 * 1000 of the visitors is greated by the standard interface (A) and
 * 300 by the new (B).
 * 250 of A and 100 of B turns into paying customers.
 * What is the p-value of difference between the two groups?
 *
 * @returns {Number} p-value of difference with 4 decimals
 */
function exercise01() {
  const nA = 1000; // Antal besökare i grupp A
  const nB = 300;  // Antal besökare i grupp B
  const xA = 250;  // Antal konverteringar i grupp A
  const xB = 100;  // Antal konverteringar i grupp B

  const pA = xA / nA; // Konverteringsfrekvens för grupp A
  const pB = xB / nB; // Konverteringsfrekvens för grupp B

  const pCombined = (xA + xB) / (nA + nB); // Kombinerad konverteringsfrekvens
  const standardError = Math.sqrt(pCombined * (1 - pCombined) * (1 / nA + 1 / nB)); // Standardfel
  const z = (pB - pA) / standardError; // Z-poäng

  // Approximation av standardnormal CDF med fel funktionen
  const standardNormalCDF = x => 0.5 * (1 + erf(x / Math.sqrt(2)));

  // Fel funktion approximation
  function erf(x) {
      // konstanter
      const a1 =  0.254829592;
      const a2 = -0.284496736;
      const a3 =  1.421413741;
      const a4 = -1.453152027;
      const a5 =  1.061405429;
      const p  =  0.3275911;

      // Spara tecknet på x
      const sign = (x >= 0) ? 1 : -1;
      x = Math.abs(x);

      // A&S formel 7.1.26
      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

      return sign * y;
  }

  // Beräkna p-värde från Z-poäng
  const pValue = 2 * (1 - standardNormalCDF(Math.abs(z)));

  return pValue.toFixed(4); // p-värde avrundat till 4 decimaler

 }

/**
 * -------------------- Svenska -------------------------
 * Givet en godtycklig datavektor med normalfördelad data.
 * Beräkna det tvåsida 95%-iga konfidensintervallet för populationens medelvärde.
 *
 * @param {Number[]} data är en vektor med godtycklig data
 * @returns {Number[]} [Undre gräns, Övre gräns]
 * ------------------------------------------------------
 *
 * Given an abitrary data array with normal distributed data.
 * Calculate the two sided 95% confidence interval for the population mean
 *
 * @param {Number[]} data is an abitrary data array
 * @returns {Number[]} [lower bound, upper bound], with 4 decimal precision
 */
function exercise02(data) {
  // Beräkna summan av alla element i 'data' arrayen
  let summa = data.reduce((a, b) => a + b, 0);

  // Beräkna medelvärdet av 'data' arrayen
  let medelvärde = summa / data.length;

  // Beräkna variansen av 'data' arrayen (urvalsvarians)
  // genom att summera de kvadrerade skillnaderna från medelvärdet
  let varians = data.reduce((a, b) => a + Math.pow(b - medelvärde, 2), 0) / (data.length - 1);

  // Beräkna standardavvikelsen genom att ta kvadratroten av variansen
  let standardavvikelse = Math.sqrt(varians);
  // Ange Z-poängen för en 95% konfidensintervall (1,96 motsvarar en 95% konfidensnivå)
  let zScore = 1.96;
  // Beräkna felmarginalen med hjälp av Z-poängen, standardavvikelsen och urvalsstorleken
  let felmarginal = zScore * (standardavvikelse / Math.sqrt(data.length));
  // Beräkna nedre gränsen för konfidensintervallet genom att subtrahera felmarginalen från medelvärdet
  let nedreGräns = medelvärde - felmarginal;
  // Beräkna övre gränsen för konfidensintervallet genom att addera felmarginalen till medelvärdet
  let övreGräns = medelvärde + felmarginal;
  // Returnera nedre och övre gränser med 4 decimalers precision som en array
  return [nedreGräns.toFixed(4), övreGräns.toFixed(4)];
  }

/**
 * -------------------- Svenska -------------------------
 * Ett företag vill att du ska göra en undersökning av hur
 * stor andel som föredrar deras varumärke över konkurrenternas.
 * De måste avsätta olika mängd pengar till undersökningen beroende
 * på vilken konfidensgrad och vilken bredd på konfidensintervallet de kan acceptera
 * Inför sin budgetförhandling behöver de därför kunna
 * beräkna hur många individer de måste få svar från
 * för att uppnå olika konfidensgrader och bredd på intervallet.
 *
 * Beräkna den maximala storleken på stickprovet vid given konfidensgrad
 * och angiven accepterad bredd på intervallet. Avrund upp till närmaste heltal
 *
 * @param {Number} confidence tabellvärde vid olika konfidensgrader. T.ex. 1.96 för 95% konfidensgrad
 * @param {Number} maxWidth Maximala accepterade bredden på konfidensintervallet.
 * @returns {Number} Maximala antalet personer som stickprovet behöver innehålla, avrundat upp.
 * ------------------------------------------------------
 *
 * A company wants you to do a survey of how large proportion
 * who prefer their brand over that of competitors.
 * They have to set aside different amounts of money for the survey
 * depending on which confidence level and the width of the confidence interval they can accept.
 * Before their budget negotiations, they therefore need to
 * be able to calculate how many individuals they must receive answers
 * from in order to achieve different confidence levels and width of the interval.
 *
 * Calculate the maximal size of the sample needed to ensure
 * the width of the confidens interval at different confidens levels. Round to nearest integer.
 *
 */
 function exercise03(confidence, maxWidth) {
   // Antag andelen p som 0.5 för den mest konservativa uppskattningen
   const p = 0.5;

   // Hälften av bredden på konfidensintervallet
   const E = maxWidth / 2;

   // Beräkna stickprovsstorleken
   const n = Math.pow(confidence, 2) * p * (1 - p) / Math.pow(E, 2);

   // Avrunda upp till närmaste heltal och returnera
   return Math.ceil(n);
 }

/**
 * -------------------- Svenska -------------------------
 * Temperaturen i Åre en vinterdag är -11°C.
 * Temperaturen nästkommande vinterdag kan beskrivas som en normalfördelning
 * med väntevärde E[T₁] = E[T₀] - 0.5 och standardavvikelse på 1.
 * (T₀ är dagens temperatur och T₁ är morgondagens)
 *
 * Vad är sannolikheten att temperaturen understiger -12°C nästa dag.
 *
 * @return {number} Sannolikheten Pr(T₁ < -12°C) med 3 decimalers precision
 * ------------------------------------------------------
 *
 * The temperature in Åre on a winter day is -11°C.
 * The temperature of the next winter day can be described as a normal distribution
 * with expected value E[T₁] = E[T₀] - 0.5 and standard deviation of 1.
 * (T₀ is today's temperature and T₁ is tomorrow's)
 *
 * What is the probability that the temperature falls below -12 ° C the next day.
 *
 */
 function exercise04() {
   const mu = -11.5; // Väntevärde
   const sigma = 1; // Standardavvikelse
   const X = -12; // Specifikt värde

   // Beräkna z-värdet
   const z = (X - mu) / sigma;

   // Använd erf-funktionen för att beräkna CDF för z-värdet
   const standardNormalCDF = x => 0.5 * (1 + erf(x / Math.sqrt(2)));

   function erf(x) {
     // konstanter
     const a1 =  0.254829592;
     const a2 = -0.284496736;
     const a3 =  1.421413741;
     const a4 = -1.453152027;
     const a5 =  1.061405429;
     const p  =  0.3275911;

     const sign = (x >= 0) ? 1 : -1;
     x = Math.abs(x);

     const t = 1.0 / (1.0 + p * x);
     const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

     return sign * y;
   }

   // Beräkna sannolikheten
   const probability = standardNormalCDF(z);

   return probability.toFixed(3); // Avrundat till 4 decimaler
 }

/**
 * -------------------- Svenska -------------------------
 * En högskola vill undersöka om deras kurser ökar studenternas kunskapsnivå.
 * Därför konstrueras två tester, A och B, i varje kurs. Dessa anses vara av samma svårighetsgrad.
 * 8 slumpmässigt utvalda studenter i varje kurs får göra ett test innan kursens start
 * och sedan det andra testet efter kursen är genomförd.
 * För att undvika systematiska fel får hälften av studenterna göra test A innan och den andra hälten B.
 *
 * Beräkna populationsmedelvärdets konfidensintervall för differensen och avgör om
 * kursen höjt studenternas resultat vid konfidensgrad 95%.
 *
 * Ledtråd: Stickprovet är litet
 *
 * @param {Number[]} preCourseResult vektor med studenternas resultat innan kursen
 * @param {Number[]} postCourseResult vektor med studenternas resultat efter kursen
 * @returns {Boolean} True om resultatet höjts efter kursen, annars false.
 * ------------------------------------------------------
 *
 * A university wants to investigate whether their courses increase students' level of knowledge.
 * Therefore, two tests, A and B, are constructed in each course. These are considered to be of the same degree of difficulty.
 * 8 randomly selected students in each course may take a test before the start of the course
 * and then the second test after the course is completed.
 * To avoid systematic errors, half of the students takes test A before and the other half B.
 *
 * Calculate the confidence interval for the population mean for the difference and decide if
 * the course increased the students' results at a confidence level of 95%.
 *
 * Hint: The sample size is small
 */
 function exercise05(preCourseResult, postCourseResult) {
   // Beräkna differensen för varje student
   const differences = postCourseResult.map((postScore, index) => postScore - preCourseResult[index]);

   // Beräkna medelvärdet av differenserna
   const meanDifference = differences.reduce((sum, value) => sum + value, 0) / differences.length;

   // Beräkna standardavvikelsen av differenserna
   const stdDeviation = Math.sqrt(differences.reduce((sum, value) => sum + Math.pow(value - meanDifference, 2), 0) / (differences.length - 1));

   // Beräkna standardfelet
   const standardError = stdDeviation / Math.sqrt(differences.length);

   // t-värde för 95% konfidens och 7 frihetsgrader (n - 1) för ensidigt test
   const tValue = 1.895; // Justerat för ensidigt test

   // Beräkna konfidensintervallet
   const marginOfError = tValue * standardError;
   const lowerBound = meanDifference - marginOfError;
   const upperBound = meanDifference + marginOfError;

   // Avgör om konfidensintervallet utesluter noll
   return lowerBound > 0;
 }

/**
 * -------------------- Svenska -------------------------
 * Under vintern görs mätningar av tjockleken av isarna på sjöar i en kommun.
 * För att föutse hur tjockleken ökar med tiden vill kommunen ha en linjär
 * modell som beskriver hur tjockleken förändras över tid på en godtycklig sjö.
 * Observationerna kan beskrivas med observationsparet (x_i, y_i) där
 * x_i är dagen i sedan första observationen och
 * y_i tjocklek dag i.
 *
 * Beräkna koefficienterna till en linjär modell (y = a + b*x)
 * från data från en godtycklig sjö.
 *
 * @param {Number[]} x är en vektor med dagar sedan första observationen för varje observation, t.ex. [0, 2, 3, 4, 7]
 * @param {Number[]} y är en vektor med istjocklek vid varje observation
 * @return {Number[]} [a, b] där a och b är koefficienterna i ekvationen Y = a + b*X
 * ------------------------------------------------------
 *
 * During the winter, measurements are made of the thickness of the ice on lakes by the municipality.
 * To predict how the thickness increases over time, the municipality wants a linear
 * model that describes how the thickness changes over time on an arbitrary lake.
 * The observations can be described with the observation pair (x_i, y_i) where
 * x_i is the day i since the first observation and
 * y_i thickness day i.
 *
 * Calculate the coefficients for a linear model (y = a + b * x)
 * from data from an arbitrary lake.
 *
 */
 function exercise06(x, y) {
   const n = x.length;
   const sumX = x.reduce((acc, val) => acc + val, 0);
   const sumY = y.reduce((acc, val) => acc + val, 0);
   const meanX = sumX / n;
   const meanY = sumY / n;

   let sumXY = 0;
   let sumXX = 0;

   for (let i = 0; i < n; i++) {
     sumXY += (x[i] - meanX) * (y[i] - meanY);
     sumXX += (x[i] - meanX) * (x[i] - meanX);
   }

   const b = sumXY / sumXX;
   const a = meanY - b * meanX;

   return [a, b];
 }
/**
 * -------------------- Svenska -------------------------
 * Givet data från en godtycklig sjö (se exercise06 för problemformulering)
 * beräkna konfidensintervall vid 95% konfidensgrad för de skattade koefficienterna för modeller
 * för istjockleken.
 * Anta att residualerna är normalfördelade och stickprovens storlek minst 30.
 *
 * @param {Number[]} x är en vektor med dagar sedan första observationen för varje observation, t.ex. [0, 2, 3, 4, 7]
 * @param {Number[]} y är en vektor med istjocklek vid varje observation
 * @return {Number[]} [a nedre gräns, a övre gräns, b nedre gräns, b övre gräns] Konfidensintervaller för koefficienterna
 * ------------------------------------------------------
 *
 * Given data from an arbitrary lake (see exercise06 for problem formulation)
 * calculate confidence intervals at confidence level 95% for the estimated coefficients for the ice thickness model.
 * Assume normal distributed residuals and a sample sice of at least 30
 */
 function exercise07(x, y) {
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    const n = x.length;
    //
    for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i]**2;
    }
    // b, regressionskoefficienten
    const b = (sumXY - (sumX*sumY)/n) / (sumXX - (sumX**2)/n);
    // a
    const a = sumY/n - (b*(sumX/n))
    // mean X
    let meanX = sumX/n;
    // SSE
    let SSE = 0;
    let temp = 0;
    for (let i = 0; i < n; i++) {
    SSE += ( y[i]-(a+b*x[i]) )**2;
    temp += (x[i]-meanX)**2; // för standardavvikelse
    }
    // MSE
    let MSE = SSE/(n-2);
    // standardavvikelse: a
    let Sa = Math.sqrt(MSE * ((1/n) + ((meanX**2)/temp)));
    // standardavvikelse: b
    let Sb = Math.sqrt(MSE / temp);
    // lambda 0.025 ger 1.96
    let lam = 1.96;
    // range, alltså bredden för intervallet
    const rangeA = lam*Sa;
    const rangeB = lam*Sb;
    return [a-rangeA, a+rangeA, b-rangeB, b+rangeB];
 }


module.exports.exercise01 = exercise01;
module.exports.exercise02 = exercise02;
module.exports.exercise03 = exercise03;
module.exports.exercise04 = exercise04;
module.exports.exercise05 = exercise05;
module.exports.exercise06 = exercise06;
module.exports.exercise07 = exercise07;
