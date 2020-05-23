        /**
         * INFO O IGRI (za mijenjanje postavki)
         */
        var bojaProtivnik1 = 'red'
        var bojaProtivnik2 = 'blue';
        var bojaPodloge = 'Snow'; //mora se dodatno mijenjat u funkcijama
        var bojaKrugova = 'lightgrey' //mora se dodatno mijenjat u funckijama
        var imeIgraca1 = 'Igrač A';
        var imeIgraca2 = 'Igrač B';
        var bodoviA = 0;
        var bodoviB = 0;
        var prviIgrac = true; //prvi igrac je protivnik1
        var jacinaLinije = 5;

        /**
         * Postavka Kanvasa
         */
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext("2d");
        var podloga = [];

        var dodatno = 0;
        var otvoriProstor = true;
        let prolazY = brojY;
        /**
         * Podloga(Pravljenje Krugova)
         */
        function napraviPodlogu() {
            for (var i = 0; i < brojX; i++) {
                if (zanimljiva2) prolazY = brojY - i;
                for (var j = 0; j < prolazY; j++) {
                    if (zanimljiva) {
                        if (j <= brojX/2)
                        dodatno = Math.floor(Math.random() * 50);
                        if (i * j > (brojX+10) && otvoriProstor) {
                            i += 3;
                            otvoriProstor = false;
                        }
                    }
                    if (zanimljiva2) {
                        dodatno = Math.floor(110 / 2*j);
                    }
                    podloga.push({
                        x: i * vrijednostX + udaljenostX + dodatno,
                        y: j * vrijednostY + udaljenostY + dodatno,
                        radius: 15,
                        color: bojaKrugova,
                        aktivan: false,
                        aktivanKrozDetekciju: false,
                        opacity: 1,
                        isClicked: function (a, b) {
                            //a^2 + b^2 < r^2
                            if (Math.pow(this.x - a, 2) + Math.pow(this.y - b, 2) < Math.pow(this.radius, 2)) return true;
                            return false;
                        }
                    });
                }
            }
        }
        napraviPodlogu();

        /**
         * Pravougaonici sa strane
         */
        var bojaLinijeSaStrane = bojaProtivnik1;
        var novaBojaLinije = 0;

        function podlogaBackground() {
            ctx.fillStyle = bojaPodloge;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (novaRunda == 3) {
                //console.log('Boja se mijenja: ' + novaRunda)
                if (novaBojaLinije == 0) {
                    bojaLinijeSaStrane = bojaProtivnik1;
                } else {
                    bojaLinijeSaStrane = bojaProtivnik2;
                }
            }
            ctx.fillStyle = bojaLinijeSaStrane;
            ctx.fillRect(100, 50, 10, 700);
            ctx.fillRect(canvas.width - 100, 50, 10, 700);
        }

        /**
         * Popuni krugove
         */
        function podlogaPopuni() {
            podloga.forEach(krug => {
                ctx.beginPath();
                ctx.globalAlpha = krug.opacity;
                ctx.arc(krug.x, krug.y, krug.radius, 0, 2 * Math.PI);
                ctx.fillStyle = krug.color;
                ctx.fill();
            })
        }


        function kolizijaLinijeKruga() {
            for (let i = 0; i < podloga.length; i++) {
                var r = 0;
                var g = 0;
                var b = 0;
                var podjela = 0;
                if (!podloga.aktivan || !podloga.aktivanKrozDetekciju) {
                    var bojaKruga = ctx.getImageData(podloga[i].x - podloga[i].radius + 5, podloga[i].y - podloga[i].radius + 5, podloga[i].radius * 2 - 11, podloga[i].radius * 2 - 11).data;
                    for (let j = 0; j < bojaKruga.length; j += 4) {
                        podjela++;
                        r += bojaKruga[j];
                        g += bojaKruga[j + 1];
                        b += bojaKruga[j + 2];
                    }
                    r = Math.floor(r / podjela);
                    g = Math.floor(g / podjela);
                    b = Math.floor(b / podjela);
                    /*
                     ctx.beginPath();
                     ctx.fillRect(podloga[i].x - podloga[i].radius + 5, podloga[i].y - podloga[i].radius + 5, podloga[i].radius * 2 - 11, podloga[i].radius *2 - 11);
                     ctx.fillStyle = 'black';
                     ctx.fill();
                     */
                    //console.log(r + ' ' + g + ' ' + b)

                    if ((r !== 211 || g !== 211 || b !== 211)) {
                        podloga[i].aktivanKrozDetekciju = true;
                    }

                }
            }
        }

        //kod sa iste stranice kao sljedeci https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function/37265703
        function provjeraDuzi(p1, p2, p3, p4) {
            function CCW(p1, p2, p3) {
                return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
            }
            return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4));
        }
        /**
         * Da li se sijeku krugovi
         */
        function daLiSeSijeku() {
            //novi trougao ne provjerava
            if (treciCvor !== 0) {
                console.log(historijaPuteva)
                var a = historijaPuteva[historijaPuteva.length - 4],
                    b = historijaPuteva[historijaPuteva.length - 3],
                    c = historijaPuteva[historijaPuteva.length - 2],
                    d = historijaPuteva[historijaPuteva.length - 1];
                console.log('ABCD ' + a + ' ' + b + ' ' + c + ' ' + d)
                var det, gamma, lambda;

                if (historijaPuteva.length > 8)
                    for (let i = 0; i < historijaPuteva.length - 2; i += 2) {
                        var p = historijaPuteva[i],
                            q = historijaPuteva[i + 1],
                            r = historijaPuteva[i + 2],
                            s = historijaPuteva[i + 3];
                        if ((p === r) && (q === s)) {
                            i += 2;
                        } else {
                            /**
                             * Prolazi kroz 2 algoritma koja provjeravaju da li se dvije prave poklapaju
                             *  
                             */
                            
                            console.log('PQRS ' + p + ' ' + q + ' ' + r + ' ' + s)
                            
                            //https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function/37265703 
                            //--Isjecak koda za detekciju kolizije izmedju pravih
                            //if (a !== p && b !== q && c !== r && d !== s) {
                                det = (c - a) * (s - q) - (r - p) * (d - b);
                                if (det !== 0) {
                                    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
                                    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
                                    if ((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)) {
                                        //console.log('RADI OVOG PQRS prvi ' + p + ' ' + q + ' ' + r + ' ' + s)
                                        return true
                                }
                            }
                            //}
                            let p1 = {x: a, y: b},
                                p2 = {x: c, y: d},
                                p3 = {x: p, y: q},
                                p4 = {x: r, y: s};
                                
                            if (provjeraDuzi(p1, p2, p3, p4) && ((a !== r) && (b !== s)) && ((c !== r) && (d !== s) && (c !== p) && (d !== q))) {
                                //console.log('RADI OVOG PQRS ' + p + ' ' + q + ' ' + r + ' ' + s)
                                //console.log(p1.x + " i " + p1.y + " sa " + p2.x + " i " + p2.y);
                                //console.log(p3.x + " i " + p3.y + " sa " + p4.x + " i " + p4.y);
                                return true;
                            }

                        }
                    }
            }
            return false
        };

        //var pokretTrougla = true;
        var historijaPuteva = [];
        var historijaBoje = [];

        /**
         * Inicijalizacija Igre
         */
        var novaBoja = 1; //1 - bojaProtivnik1, 0 - bojaProtivnik2
        ctx.strokeStyle = bojaProtivnik1;
        document.getElementById("ime-igraca").innerText = imeIgraca1;
        document.getElementById("trenutni-igraciA").innerText = imeIgraca1;
        document.getElementById("trenutni-igraciB").innerText = imeIgraca2;
        document.getElementById("trenutni-bodoviA").innerText = bodoviA;
        document.getElementById("trenutni-bodoviB").innerText = bodoviB;

        var mijenjajProtivnika = 0;
        var novaRunda = 0;

        var vracanjeNaStaroX = null;
        var vracanjeNaStaroY = null;
        var novaRundaLista = [];
        var novaKonekcija = false;
        var treciCvor = null;

        var nijeOpetX = null;
        var nijeOpetY = null;
        var brojPonavljanjaX = 0;
        var brojPonavljanjaY = 0;

        /**
         * provjera da li su 3 u istom redu/koloni
         */
        function nijeIstiRed(x, y) {
            //console.log("broj X " + brojPonavljanjaX + " broj Y " + brojPonavljanjaY);
            if (brojPonavljanjaX === 0 && brojPonavljanjaY === 0) {
                nijeOpetX = x;
                nijeOpetY = y;
                brojPonavljanjaX++;
                brojPonavljanjaY++;
            } else {
                if (nijeOpetX == x) {
                    brojPonavljanjaX++;
                }
                if (nijeOpetY == y) {
                    brojPonavljanjaY++;
                }
            }
        }

        /**
         * igra gotova, resetuje se
         *  
         * */
        var nemaKrugova = false;
        function igraGotova() {
            let pobjednikHistorija = historijaBoje[historijaBoje.length - 1];
            if (nemaKrugova) {
                if (pobjednikHistorija === 1) pobjednikHistorija = 0;
                else pobjednikHistorija = 1;
            }
            if (pobjednikHistorija == 1) {
                document.getElementById("pobjednik-kraj").textContent = imeIgraca2;
                bodoviB++;
            } else {
                bodoviA++;
                document.getElementById("pobjednik-kraj").textContent = imeIgraca1;
            }

            if (prviIgrac) {
                //mijenjanje imena strane
                document.getElementById("trenutni-igraciA").innerText = imeIgraca2;
                document.getElementById("trenutni-igraciB").innerText = imeIgraca1;

                document.getElementById("ime-igraca").innerText = imeIgraca2;
                novaBoja = 0;
                bojaLinijeSaStrane = bojaProtivnik2;
                //mijenjanje bodova strane
                document.getElementById("trenutni-bodoviA").innerText = bodoviB;
                document.getElementById("trenutni-bodoviB").innerText = bodoviA;
                prviIgrac = false;
            } else {
                document.getElementById("trenutni-igraciA").innerText = imeIgraca1;
                document.getElementById("trenutni-igraciB").innerText = imeIgraca2;

                document.getElementById("ime-igraca").innerText = imeIgraca1;
                novaBoja = 1;
                bojaLinijeSaStrane = bojaProtivnik1;
                //mijenjanje bodova strane 2
                document.getElementById("trenutni-bodoviB").innerText = bodoviA;
                document.getElementById("trenutni-bodoviA").innerText = bodoviB;
                prviIgrac = true;
            }

            /**
             * Igra gotova - reset sve
             */
            var krajIgre = document.getElementById("kraj-igre");
            krajIgre.style.visibility = "visible";

            /**
             * Inicijalizacija ponovo
             */
            podloga = [];
            historijaPuteva = [];
            historijaBoje = [];
            mijenjajProtivnika = 0;

            novaRunda = 0;
            brojPonavljanjaX = 0;
            brojPonavljanjaY = 0;
            vracanjeNaStaroX = null;
            vracanjeNaStaroY = null;
            novaRundaLista = [];
            novaKonekcija = false;
            treciCvor = null;
            otvoriProstor = true;
            nemaKrugova = false;

            novaBojaLinije = 0;
            napraviPodlogu();
            context.clearRect(0, 0, canvas.width, canvas.height); //nepotrebno, za testiranje
        }


        function crtanjeTrougla(x, y) {
            //console.log("koord X " + nijeOpetX + " koord Y " + nijeOpetY);
            //console.log(' X --> ' + x  +  ' Y-->  ' + y)
            ctx.lineWidth = jacinaLinije;

            if (novaRunda == 2) {
                if (novaBoja == 1) {
                    document.getElementById("ime-igraca").innerText = imeIgraca2;
                    novaBojaLinije = 1;
                } else {
                    document.getElementById("ime-igraca").innerText = imeIgraca1;
                    novaBojaLinije = 0;
                }
                brojPonavljanjaX = 0;
                brojPonavljanjaY = 0;
            }

            if (novaRunda !== 3) {
                if (historijaPuteva.length == 0) {

                    historijaPuteva.push(x);
                    historijaPuteva.push(y);
                    vracanjeNaStaroX = x;
                    vracanjeNaStaroY = y;

                    novaRundaLista.push(x);
                    novaRundaLista.push(y);

                } else {
                    if (novaRunda == 0) {
                        novaRundaLista.push(x);
                        novaRundaLista.push(y);
                    }

                    ctx.beginPath();
                    ctx.moveTo(historijaPuteva[historijaPuteva.length - 2], historijaPuteva[historijaPuteva.length - 1]);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    ctx.closePath();


                    //console.log('sa: ' + historijaPuteva[historijaPuteva.length-2] + ' i sa:  ' + historijaPuteva[historijaPuteva.length -1])
                    historijaPuteva.push(x);
                    historijaPuteva.push(y);
                    novaKonekcija = false;

                }
            } else {
                novaRunda = 0;
                novaKonekcija = true;
                vracanjeNaStaroX = x;
                vracanjeNaStaroY = y;
                historijaPuteva.push(novaRundaLista[novaRundaLista.length - 2]);
                historijaPuteva.push(novaRundaLista[novaRundaLista.length - 1]);

                historijaPuteva.push(x);
                historijaPuteva.push(y);

                if (novaBoja == 1) {
                    ctx.strokeStyle = bojaProtivnik2;
                    novaBoja = 0;
                } else {
                    ctx.strokeStyle = bojaProtivnik1;
                    novaBoja = 1;
                }
            }
            console.log(daLiSeSijeku());
            /**
             * 
             * KRAJ IGRE
             * 
             */
            if (daLiSeSijeku()) {
                igraGotova();
            }

            if (treciCvor == 2) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(vracanjeNaStaroX, vracanjeNaStaroY);
                //console.log(' X --> ' + x  +  ' Y-->  ' + y)
                //console.log(' X2 --> ' + vracanjeNaStaroX  +  ' Y2-->  ' + vracanjeNaStaroY)
                ctx.stroke();
                ctx.closePath();
                treciCvor = -1;
                historijaPuteva.push(vracanjeNaStaroX);
                historijaPuteva.push(vracanjeNaStaroY);
                if (daLiSeSijeku()) {
                    igraGotova();
                }
            }

            if (novaKonekcija) {
                novaRundaLista.push(vracanjeNaStaroX);
                novaRundaLista.push(vracanjeNaStaroY);
            }

            kolizijaLinijeKruga();

            historijaBoje.push(novaBoja);
            mijenjajProtivnika++;
            novaRunda++;
            treciCvor++;
        }

        /**
         * prolazi kroz historiju puteva i crta svaku iteraciju intervala
         */
        function nacrtajLinije() {
            let mijenjajBoju = 0;
            let sljedeci = 0;
            if (historijaPuteva.length >= 4)
                for (let i = 0; i < historijaPuteva.length - 2; i += 2) {
                    if (sljedeci == 3) {
                        i += 4;
                        sljedeci = 0;
                    }
                    if (historijaBoje[mijenjajBoju] == 1) ctx.strokeStyle = bojaProtivnik1;
                    else ctx.strokeStyle = bojaProtivnik2;
                    ctx.beginPath();
                    ctx.moveTo(historijaPuteva[i], historijaPuteva[i + 1]);
                    ctx.lineTo(historijaPuteva[i + 2], historijaPuteva[i + 3]);
                    ctx.stroke();
                    ctx.closePath();
                    mijenjajBoju++;
                    sljedeci++;
                }
        }

        //ukoliko nema slobodnih krugova na ploci
        function preostaliKrugovi() {
            var preostalo = 0;
            for (let i = 0; i < podloga.length; i++) {
                if (podloga[i].aktivan || podloga[i].aktivanKrozDetekciju) preostalo++;
            }
            if ((podloga.length - preostalo) <= 1) {
                nemaKrugova = true;
                return true;
            }
            return false
        }

        //uzima vrijednosti x i y iz objekta(niza) podloga i stavlja u niz zasebno x i y
        var vrijednostiX = podloga.map(a => a.x);
        var vrijednostiY = podloga.map(a => a.y);

        canvas.addEventListener('mousedown', function (event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;


            var bojaSlike = ctx.getImageData(x, y, 1, 1).data;
            var r = bojaSlike[0];
            var g = bojaSlike[1];
            var b = bojaSlike[2];


            //https://stackoverflow.com/questions/8584902/get-closest-number-out-of-array -- najblizi broj od brojeva u nizu
            var najbliziKrugX = vrijednostiX.reduce(function (prev, curr) {
                return (Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
            });
            var najbliziKrugY = vrijednostiY.reduce(function (prev, curr) {
                return (Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev);
            });

            if (preostaliKrugovi()) igraGotova();
            for (var i = 0; i < podloga.length; i++) {
                if (podloga[i].isClicked(x, y) && (r == 211 && g == 211 && b == 211)) {

                    nijeIstiRed(najbliziKrugX, najbliziKrugY);
                    /**
                     * provjera da li je igrac u istoj koloni/redu izabrao sljedeci put
                     */
                    if (brojPonavljanjaX >= 3 || brojPonavljanjaY >= 3) {
                        if (brojPonavljanjaX >= 3) {
                            if (nijeOpetX != najbliziKrugX) {
                                brojPonavljanjaX = 0;
                                brojPonavljanjaY = 0;
                            } else
                                alert("Ne možete u istoj koloni imati sve prave");
                        } else if (brojPonavljanjaY >= 3) {
                            if (nijeOpetY != najbliziKrugY) {
                                brojPonavljanjaX = 0;
                                brojPonavljanjaY = 0;
                            } else
                                alert("Ne možete u istom redu imati sve prave");
                        }


                    } else {
                        crtanjeTrougla(najbliziKrugX, najbliziKrugY);
                        podloga[i].color = "darkred";
                        podloga[i].aktivan = true;
                    }
                } else if (podloga[i].aktivanKrozDetekciju && podloga[i].aktivan == false) {
                    podloga[i].color = 'indianred';
                    podloga[i].opacity = 0.5;
                }
            }
        });

        //funkcija koja pokrece sve sa setIntervalom
        function pokreniTriba() {
            podlogaBackground();
            podlogaPopuni();
            nacrtajLinije();
        }

        var pokreniIgru = setInterval(pokreniTriba, 150);