var Uniprot = require('../src/Uniprot.js');
var assert = require("should");
var fs = require('fs')

describe('UniprotReader', function() {
    var reader = new Uniprot.Reader();
    var check = function(src, fct) {
        var content = "" + fs.readFileSync('test/data/' + src, {
            encodind : 'utf-8'
        })

        fct(content)

    }
    it('constructor', function() {
        reader.should.not.equal(undefined);
    })
    it('file dat length', function() {
        check('P01308.txt', function(txt) {
            (txt.length).should.equal(40972);
        })
    })
    describe('datEntries', function() {
        it('count one entry', function() {
            check('P01308.txt', function(txt) {
                var dats = reader.datEntries(txt);
                dats.length.should.equal(1);
            })
        })
        it('count entries', function() {
            check('mammals_10k.dat', function(txt) {
                var dats = reader.datEntries(txt);
                dats.length.should.equal(98);
            })
        })
    })
    describe('groupByField', function() {
        it('count one entry ID', function() {
            check('P01308.txt', function(txt) {
                var map = reader.groupByField(txt);
                (map.ID).should.equal('INS_HUMAN               Reviewed;         110 AA.')
            })
        })
        it('count one entry AC', function() {
            check('P01308.txt', function(txt) {
                var map = reader.groupByField(txt);
                (map.AC).should.equal('P01308; Q5EEX2;')
            })
        })
        it('count one entry sequence', function() {
            check('P01308.txt', function(txt) {
                var map = reader.groupByField(txt);
                (map.sequence).should.equal('MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN')
            })
        })
    });
    describe('buildCanonicalEntry', function() {
        it('P01308 id', function() {
            check('P01308.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                (p.id).should.equal('INS_HUMAN')
            })
        })
        it('P01308 accessionCodes', function() {
            check('P01308.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                p.accessionCodes.should.eql(['P01308', 'Q5EEX2'])
            })
        })
        it('P01308 OS', function() {
            check('P01308.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                (p.OS).should.equal('Homo sapiens (Human)')
            })
        })
        it('P01308 ncbi_taxid', function() {
            check('P01308.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                (p.ncbi_taxid).should.equal(9606)
            })
        })
        it('P01308 OC', function() {
            check('P01308.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                (p.OC).should.eql(['Eukaryota', 'Metazoa', 'Chordata', 'Craniata', 'Vertebrata', 'Euteleostomi', 'Mammalia', 'Eutheria', 'Euarchontoglires', 'Primates', 'Haplorrhini', 'Catarrhini', 'Hominidae', 'Homo']);
            })
        })
        it('P01308 sequence', function() {
            check('P01308.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                (p.sequence).should.equal('MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN')
            })
        })
        it('OC in multiple words id', function() {
            check('002R_IIV3.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                (p.id).should.equal('002R_IIV3')
            })
        })
        it('OC in multiple words OS', function() {
            check('002R_IIV3.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                (p.OS).should.equal('Invertebrate iridescent virus 3 (IIV-3) (Mosquito iridescent virus)')
            })
        })
        it('OC in multiple words OC', function() {
            check('002R_IIV3.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                (p.OC).should.eql(['Viruses', 'dsDNA viruses, no RNA stage', 'Iridoviridae', 'Chloriridovirus']);
            })
        })
        it('CC structured SUBUNIT', function() {
            check('P01308.txt', function(txt) {
                var cces = reader.getField(txt, 'cces')
                cces['SUBUNIT'].should.equal("Heterodimer of a B chain and an A chain linked by two\n    disulfide bonds.")
            })
        })
        it('CC structured SEQUENCE CAUTION', function() {
            check('P01308.txt', function(txt) {
                var cces = reader.getField(txt, 'cces')
                cces['SEQUENCE CAUTION'].should.equal('Sequence=AAA59179.1; Type=Erroneous gene model prediction;')
            })
        })
        it('CC structured WEB RESOURCE', function() {
            check('P01308.txt', function(txt) {
                var cces = reader.getField(txt, 'cces')
                cces['WEB RESOURCE'].length.should.equal(4)
            })
        })
        it('features', function() {
            check('P01308.txt', function(txt) {
                var fts = reader.getField(txt, 'features')
                fts.should.have.length(42)
            });
        })
        it('features VAR_063734 id', function() {
            check('P01308.txt', function(txt) {
                var fts = reader.getField(txt, 'features')
                var ft = fts.filter(function(f){
                return f.id == 'VAR_063734';
                })[0];
                ft.id.should.equal('VAR_063734')
            });
        })
        it('features VAR_063734 pos start', function() {
            check('P01308.txt', function(txt) {
                var fts = reader.getField(txt, 'features')
                fts.should.have.length(42)
                var ft = fts.filter(function(f){
                return f.id == 'VAR_063734';
                })[0];
                ft.should.have.property('start', 83)
            });
        })
        it('features VAR_063734 pos start', function() {
            check('P01308.txt', function(txt) {
                var fts = reader.getField(txt, 'features')
                fts.should.have.length(42)
                var ft = fts.filter(function(f){
                return f.id == 'VAR_063734';
                })[0];
                ft.should.have.property('end', 83)
            });
        })
        it('Pmixed', function() {
            check('Pmixed.txt', function(txt) {
                var p = reader.buildCanonicalEntry(txt);
                p.accessionCodes.should.eql(['P01308', 'Q5EEX2', 'P62262', 'P29360', 'P42655', 'Q63631'])
            })
        })
        describe('DR PDB', function() {
            it('get xref pdbs', function() {
                check('P01308.txt', function(txt) {
                    var p = reader.buildCanonicalEntry(txt);
                    p.xrefs.should.not.equal(undefined);
                    p.xrefs.PDB.should.not.equal(undefined);
                    var pdbx = p.xrefs.PDB[0];

                });
            });
            it('get xref pdbs', function() {
                check('P01308.txt', function(txt) {
                    var p = reader.buildCanonicalEntry(txt);
                    p.xrefs.should.not.equal(undefined);
                    p.xrefs.PDB.should.not.equal(undefined);
                    var pdbx = p.xrefs.PDB[0];

                });
            });
            it('get xref pdb, single', function() {
                //DR   PDB; 1EFE; NMR; -; A=25-110.

                check('P01308.txt', function(txt) {
                    var p = reader.buildCanonicalEntry(txt);
                    var pdbx = p.xrefs.PDB[5];
                    pdbx.method.should.equal('NMR');
                    pdbx.id.should.equal('1EFE');
                    pdbx.resolution.should.equal('-');
                    pdbx.chains.should.eql([{
                        name : 'A',
                        start : 24,
                        end : 109
                    }]);

                });
            });
            it('get xref pdb, double', function() {
                //DR   PDB; 1EV3; X-ray; 1.78 A; A/C=90-110, B/D=25-54.
                check('P01308.txt', function(txt) {
                    var p = reader.buildCanonicalEntry(txt);
                    var pdbx = p.xrefs.PDB[6];
                    pdbx.method.should.equal('X-ray');
                    pdbx.id.should.equal('1EV3');
                    pdbx.resolution.should.equal('1.78 A');
                    pdbx.chains.should.eql([{
                        name : 'A/C',
                        start : 89,
                        end : 109
                    }, {
                        name : 'B/D',
                        start : 24,
                        end : 53
                    }]);

                });
            });

        })
    })
    describe('applyFeaturesVSP', function() {
        var check = function(comment, sequence, vsps, exp) {
            it(comment + ":" + sequence + vsps + ' -> ' + exp, function() {
                (reader.applyFeaturesVSP(sequence, vsps)).should.equal(exp)
            })
        }
        check('no change', 'ABCDEFGHIJKLMNOP', [], 'ABCDEFGHIJKLMNOP')
        check('one mutation, start', 'ABCDEFGHIJKLMNOP', [{
            start : 0,
            end : 0,
            replacedBy : 'Z'
        }], 'ZBCDEFGHIJKLMNOP')
        check('one mutation', 'ABCDEFGHIJKLMNOP', [{
            start : 5,
            end : 5,
            replacedBy : 'Z'
        }], 'ABCDEZGHIJKLMNOP')
        check('one large removeal', 'ABCDEFGHIJKLMNOP', [{
            start : 5,
            end : 8,
            replacedBy : 'Z'
        }], 'ABCDEZJKLMNOP')
        check('one large removeal, large add', 'ABCDEFGHIJKLMNOP', [{
            start : 5,
            end : 8,
            replacedBy : 'ZYXWV'
        }], 'ABCDEZYXWVJKLMNOP')
        check('multiple change', 'ABCDEFGHIJKLMNOP', [{
            start : 5,
            end : 5,
            replacedBy : 'Z'
        }, {
            start : 8,
            end : 9,
            replacedBy : 'XYZ'
        }], 'ABCDEZGHXYZKLMNOP')
        check('multiple change, missorted 1', 'ABCDEFGHIJKLMNOP', [{
            start : 5,
            end : 5,
            replacedBy : 'QR'
        }, {
            start : 8,
            end : 9,
            replacedBy : 'XYZ'
        }], 'ABCDEQRGHXYZKLMNOP')
        check('multiple change, missorted 2', 'ABCDEFGHIJKLMNOP', [{
            start : 8,
            end : 9,
            replacedBy : 'XYZ'
        }, {
            start : 5,
            end : 5,
            replacedBy : 'QR'
        }], 'ABCDEQRGHXYZKLMNOP')
    })
    describe('isoforms', function() {
        it('P01308', function() {
            check('P01308.txt', function(txt) {
                var isoforms = reader.buildIsoformEntries(txt);
                isoforms.should.have.length(1);

            });
        })
        it('P01308', function() {
            check('P01308.txt', function(txt) {
                var isoforms = reader.buildIsoformEntries(txt);
                (isoforms[0].sequence).should.equal(P01308Isoforms['P01308']);

            });
        })
        it('P01308 OS', function() {
            check('P01308.txt', function(txt) {
                var isoforms = reader.buildIsoformEntries(txt);
                isoforms[0].OS.should.equal('Homo sapiens (Human)');
            });
        })
        it('P01308 ncbi_taxid', function() {
            check('P01308.txt', function(txt) {
                var isoforms = reader.buildIsoformEntries(txt);
                isoforms[0].ncbi_taxid.should.equal(9606);
            });
        })
        it('P01308 OC', function() {
            check('P01308.txt', function(txt) {
                var isoforms = reader.buildIsoformEntries(txt);
                isoforms[0].OC.should.eql(['Eukaryota', 'Metazoa', 'Chordata', 'Craniata', 'Vertebrata', 'Euteleostomi', 'Mammalia', 'Eutheria', 'Euarchontoglires', 'Primates', 'Haplorrhini', 'Catarrhini', 'Hominidae', 'Homo']);
            });
        })
        it('P15381', function() {
            check('P15381.txt', function(txt) {
                var isoforms = reader.buildIsoformEntries(txt);
                (isoforms.map(function(e) {
                        return e.id
                    }).sort()).should.eql(['CAC1C_RABIT', 'P15381-2', 'P15381-3', 'P15381-4', 'P15381-5']);

                isoforms.forEach(function(iso) {
                    (iso.sequence).should.equal(P15381Isoforms[iso.id])
                })
            });
        })
    })
    var P01308Isoforms = {
        P01308 : 'MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN'
    }
    var P15381Isoforms = {
        'CAC1C_RABIT' : 'MLRALVQPATPAYQPLPSHLSAETESTCKGTVVHEAQLNHFYISPGGSNYGSPRPAHANMNANAAAGLAPEHIPTPGAALSWQAAIDAARQAKLMGSAGNATISTVSSTQRKRQQYGKPKKQGSTTATRPPRALLCLTLKNPIRRACISIVEWKPFEIIILLTIFANCVALAIYIPFPEDDSNATNSNLERVEYLFLIIFTVEAFLKVIAYGLLFHPNAYLRNGWNLLDFIIVVVGLFSAILEQATKADGANALGGKGAGFDVKALRAFRVLRPLRLVSGVPSLQVVLNSIIKAMVPLLHIALLVLFVIIIYAIIGLELFMGKMHKTCYNQEGVADVPAEDDPSPCALETGHGRQCQNGTVCKPGWDGPKHGITNFDNFAFAMLTVFQCITMEGWTDVLYWMQDAMGYELPWVYFVSLVIFGSFFVLNLVLGVLSGEFSKEREKAKARGDFQKLREKQQLEEDLKGYLDWITQAEDIDPENEDEGMDEEKPRNMSMPTSETESVNTENVAGGDIEGENCGARLAHRISKSKFSRYWRRWNRFCRRKCRAAVKSNVFYWLVIFLVFLNTLTIASEHYNQPHWLTEVQDTANKALLALFTAEMLLKMYSLGLQAYFVSLFNRFDCFIVCGGILETILVETKVMSPLGISVLRCVRLLRIFKITRYWNSLSNLVASLLNSVRSIASLLLLLFLFIIIFSLLGMQLFGGKFNFDEMQTRRSTFDNFPQSLLTVFQILTGEDWNSVMYDGIMAYGGPSFPGMLVCIYFIILFICGNYILLNVFLAIAVDNLADAESLTSAQKEEEEEKERKKLARTASPEKKQEVVGKPALEEAKEEKIELKSITADGESPPTTKINMDDLQPNESEDKSPYPNPETTGEEDEEEPEMPVGPRPRPLSELHLKEKAVPMPEASAFFIFSPNNRFRLQCHRIVNDTIFTNLILFFILLSSISLAAEDPVQHTSFRNHILFYFDIVFTTIFTIEIALKMTAYGAFLHKGSFCRNYFNILDLLVVSVSLISFGIQSSAINVVKILRVLRVLRPLRAINRAKGLKHVVQCVFVAIRTIGNIVIVTTLLQFMFACIGVQLFKGKLYTCSDSSKQTEAECKGNYITYKDGEVDHPIIQPRSWENSKFDFDNVLAAMMALFTVSTFEGWPELLYRSIDSHTEDKGPIYNYRVEISIFFIIYIIIIAFFMMNIFVGFVIVTFQEQGEQEYKNCELDKNQRQCVEYALKARPLRRYIPKNQHQYKVWYVVNSTYFEYLMFVLILLNTICLAMQHYGQSCLFKIAMNILNMLFTGLFTVEMILKLIAFKPKGYFSDPWNVFDFLIVIGSIIDVILSETNPAEHTQCSPSMNAEENSRISITFFRLFRVMRLVKLLSRGEGIRTLLWTFIKSFQALPYVALLIVMLFFIYAVIGMQVFGKIALNDTTEINRNNNFQTFPQAVLLLFRCATGEAWQDIMLACMPGKKCAPESEPHNSTEGETPCGSSFAVFYFISFYMLCAFLIINLFVAVIMDNFDYLTRDWSILGPHHLDEFKRIWAEYDPEAKGRIKHLDVVTLLRRIQPPLGFGKLCPHRVACKRLVSMNMPLNSDGTVMFNATLFALVRTALRIKTEGNLEQANEELRAIIKKIWKRTSMKLLDQVVPPAGDDEVTVGKFYATFLIQEYFRKFKKRKEQGLVGKPSQRNALSLQAGLRTLHDIGPEIRRAISGDLTAEEELDKAMKEAVSAASEDDIFRRAGGLFGNHVSYYQSDSRSAFPQTFTTQRPLHISKAGNNQGDTESPSHEKLVDSTFTPSSYSSTGSNANINNANNTALGRLPRPAGYPSTVSTVEGHGSPLSPAVRAQEAAWKLSSKRCHSQESQIAMACQEGASQDDNYDVRIGEDAECCSEPSLLSTEMLSYQDDENRQLAPPEEEKRDIRLSPKKGFLRSASLGRRASFHLECLKRQKNQGGDISQKTVLPLHLVHHQALAVAGLSPLLQRSHSPTSLPRPCATPPATPGSRGWPPQPIPTLRLEGADSSEKLNSSFPSIHCGSWSGENSPCRGDSSAARRARPVSLTVPSQAGAQGRQFHGSASSLVEAVLISEGLGQFAQDPKFIEVTTQELADACDLTIEEMENAADDILSGGARQSPNGTLLPFVNRRDPGRDRAGQNEQDASGACAPGCGQSEEALADRRAGVSSL',
        'P15381-5' : 'MVNENTRMYIPEENHQGSNYGSPRPAHANMNANAALSWQAAIDAARQAKLMGSAGNATISTVSSTQRKRQQYGKPKKQGSTTATRPPRALLCLTLKNPIRRACISIVEWKPFEIIILLTIFANCVALAIYIPFPEDDSNATNSNLERVEYLFLIIFTVEAFLKVIAYGLLFHPNAYLRNGWNLLDFIIVVVGLFSAILEQATKADGANALGGKGAGFDVKALRAFRVLRPLRLVSGVPSLQVVLNSIIKAMVPLLHIALLVLFVIIIYAIIGLELFMGKMHKTCYNQEGVADVPAEDDPSPCALETGHGRQCQNGTVCKPGWDGPKHGITNFDNFAFAMLTVFQCITMEGWTDVLYWMQDAMGYELPWVYFVSLVIFGSFFVLNLVLGVLSGEFSKEREKAKARGDFQKLREKQQLEEDLKGYLDWITQAEDIDPENEDEGMDEEKPRNMSMPTSETESVNTENVAGGDIEGENCGARLAHRISKSKFSRYWRRWNRFCRRKCRAAVKSNVFYWLVIFLVFLNTLTIASEHYNQPHWLTEVQDTANKALLALFTAEMLLKMYSLGLQAYFVSLFNRFDCFIVCGGILETILVETKVMSPLGISVLRCVRLLRIFKITRYWNSLSNLVASLLNSVRSIASLLLLLFLFIIIFSLLGMQLFGGKFNFDEMQTRRSTFDNFPQSLLTVFQILTGEDWNSVMYDGIMAYGGPSFPGMLVCIYFIILFICGNYILLNVFLAIAVDNLADAESLTSAQKEEEEEKERKKLARTASPEKKQEVVGKPALEEAKEEKIELKSITADGESPPTTKINMDDLQPNESEDKSPYPNPETTGEEDEEEPEMPVGPRPRPLSELHLKEKAVPMPEASAFFIFSPNNRFRLQCHRIVNDTIFTNLILFFILLSSISLAAEDPVQHTSFRNHILFYFDIVFTTIFTIEIALKMTAYGAFLHKGSFCRNYFNILDLLVVSVSLISFGIQSSAINVVKILRVLRVLRPLRAINRAKGLKHVVQCVFVAIRTIGNIVIVTTLLQFMFACIGVQLFKGKLYTCSDSSKQTEAECKGNYITYKDGEVDHPIIQPRSWENSKFDFDNVLAAMMALFTVSTFEGWPELLYRSIDSHTEDKGPIYNYRVEISIFFIIYIIIIAFFMMNIFVGFVIVTFQEQGEQEYKNCELDKNQRQCVEYALKARPLRRYIPKNQHQYKVWYVVNSTYFEYLMFVLILLNTICLAMQHYGQSCLFKIAMNILNMLFTGLFTVEMILKLIAFKPKGYFSDPWNVFDFLIVIGSIIDVILSETNPAEHTQCSPSMNAEENSRISITFFRLFRVMRLVKLLSRGEGIRTLLWTFIKSFQALPYVALLIVMLFFIYAVIGMQVFGKIALNDTTEINRNNNFQTFPQAVLLLFRCATGEAWQDIMLACMPGKKCAPESEPHNSTEGETPCGSSFAVFYFISFYMLCAFLIINLFVAVIMDNFDYLTRDWSILGPHHLDEFKRIWAEYDPEAKGRIKHLDVVTLLRRIQPPLGFGKLCPHRVACKRLVSMNMPLNSDGTVMFNATLFALVRTALRIKTEGNLEQANEELRAIIKKIWKRTSMKLLDQVVPPAGDDEVTVGKFYATFLIQEYFRKFKKRKEQGLVGKPSQRNALSLQAGLRTLHDIGPEIRRAISGDLTAEEELDKAMKEAVSAASEDDIFRRAGGLFGNHVSYYQSDSRSAFPQTFTTQRPLHISKAGNNQGDTESPSHEKLVDSTFTPSSYSSTGSNANINNANNTALGRLPRPAGYPSTVSTVEGHGSPLSPAVRAQEAAWKLSSKRCHSQESQIAMACQEGASQDDNYDVRIGEDAECCSEPSLLSTEMLSYQDDENRQLAPPEEEKRDIRLSPKKGFLRSASLGRRASFHLECLKRQKNQGGDISQKTVLPLHLVHHQALAVAGLSPLLQRSHSPTSLPRPCATPPATPGSRGWPPQPIPTLRLEGADSSEKLNSSFPSIHCGSWSGENSPCRGDSSAARRARPVSLTVPSQAGAQGRQFHGSASSLVEAVLISEGLGQFAQDPKFIEVTTQELADACDLTIEEMENAADDILSGGARQSPNGTLLPFVNRRDPGRDRAGQNEQDASGACAPGCGQSEEALADRRAGVSSL',
        'P15381-4' : 'MVNENTRMYIPEENHQGSNYGSPRPAHANMNANAAAGLAPEHIPTPGAALSWQAAIDAARQAKLMGSAGNATISTVSSTQRKRQQYGKPKKQGSTTATRPPRALLCLTLKNPIRRACISIVEWKPFEIIILLTIFANCVALAIYIPFPEDDSNATNSNLERVEYLFLIIFTVEAFLKVIAYGLLFHPNAYLRNGWNLLDFIIVVVGLFSAILEQATKADGANALGGKGAGFDVKALRAFRVLRPLRLVSGVPSLQVVLNSIIKAMVPLLHIALLVLFVIIIYAIIGLELFMGKMHKTCYNQEGVADVPAEDDPSPCALETGHGRQCQNGTVCKPGWDGPKHGITNFDNFAFAMLTVFQCITMEGWTDVLYWVNDAVGRDWPWIYFVTLIIIGSFFVLNLVLGVLSGEFSKEREKAKARGDFQKLREKQQLEEDLKGYLDWITQAEDIDPENEDEGMDEEKPRNRGTPAGLHAQKKGKFAWFSHSTETHVSMPTSETESVNTENVAGGDIEGENCGARLAHRISKSKFSRYWRRWNRFCRRKCRAAVKSNVFYWLVIFLVFLNTLTIASEHYNQPHWLTEVQDTANKALLALFTAEMLLKMYSLGLQAYFVSLFNRFDCFIVCGGILETILVETKVMSPLGISVLRCVRLLRIFKITRYWNSLSNLVASLLNSVRSIASLLLLLFLFIIIFSLLGMQLFGGKFNFDEMQTRRSTFDNFPQSLLTVFQILTGEDWNSVMYDGIMAYGGPSFPGMLVCIYFIILFICGNYILLNVFLAIAVDNLADAESLTSAQKEEEEEKERKKLARTASPEKKQEVVGKPALEEAKEEKIELKSITADGESPPTTKINMDDLQPNESEDKSPYPNPETTGEEDEEEPEMPVGPRPRPLSELHLKEKAVPMPEASAFFIFSPNNRFRLQCHRIVNDTIFTNLILFFILLSSISLAAEDPVQHTSFRNHILFYFDIVFTTIFTIEIALKMTAYGAFLHKGSFCRNYFNILDLLVVSVSLISFGIQSSAINVVKILRVLRVLRPLRAINRAKGLKHVVQCVFVAIRTIGNIVIVTTLLQFMFACIGVQLFKGKLYTCSDSSKQTEAECKGNYITYKDGEVDHPIIQPRSWENSKFDFDNVLAAMMALFTVSTFEGWPELLYRSIDSHTEDKGPIYNYRVEISIFFIIYIIIIAFFMMNIFVGFVIVTFQEQGEQEYKNCELDKNQRQCVEYALKARPLRRYIPKNQHQYKVWYVVNSTYFEYLMFVLILLNTICLAMQHYGQSCLFKIAMNILNMLFTGLFTVEMILKLIAFKPKHYFCDAWNTFDALIVVGSIVDIAITEVHPAEHTQCSPSMNAEENSRISITFFRLFRVMRLVKLLSRGEGIRTLLWTFIKSFQALPYVALLIVMLFFIYAVIGMQVFGKIALNDTTEINRNNNFQTFPQAVLLLFRCATGEAWQDIMLACMPGKKCAPESEPHNSTEGETPCGSSFAVFYFISFYMLCAFLIINLFVAVIMDNFDYLTRDWSILGPHHLDEFKRIWAEYDPEAKGRIKHLDVVTLLRRIQPPLGFGKLCPHRVACKRLVSMNMPLNSDGTVMFNATLFALVRTALRIKTEGNLEQANEELRAIIKKIWKRTSMKLLDQVVPPAGDDEVTVGKFYATFLIQEYFRKFKKRKEQGLVGKPSQRNALSLQAGLRTLHDIGPEIRRAISGDLTAEEELDKAMKEAVSAASEDDIFRRAGGLFGNHVSYYQSDSRSAFPQTFTTQRPLHISKAGNNQGDTESPSHEKLVDSTFTPSSYSSTGSNANINNANNTALGRLPRPAGYPSTVSTVEGHGSPLSPAVRAQEAAWKLSSKRCHSQESQIAMACQEGASQDDNYDVRIGEDAECCSEPSLLSTEMLSYQDDENRQLAPPEEEKRDIRLSPKKGFLRSASLGRRASFHLECLKRQKNQGGDISQKTVLPLHLVHHQALAVAGLSPLLQRSHSPTSLPRPCATPPATPGSRGWPPQPIPTLRLEGADSSEKLNSSFPSIHCGSWSGENSPCRGDSSAARRARPVSLTVPSQAGAQGRQFHGSASSLVEAVLISEGLGQFAQDPKFIEVTTQELADACDLTIEEMENAADDILSGGARQSPNGTLLPFVNRRDPGRDRAGQNEQDASGACAPGCGQSEEALADRRAGVSSL',
        'P15381-3' : 'MLRALVQPATPAYQPLPSHLSAETESTCKGTVVHEAQLNHFYISPGGSNYGSPRPAHANMNANAAAGLAPEHIPTPGAALSWQAAIDAARQAKLMGSAGNATISTVSSTQRKRQQYGKPKKQGSTTATRPPRALLCLTLKNPIRRACISIVEWKPFEIIILLTIFANCVALAIYIPFPEDDSNATNSNLERVEYLFLIIFTVEAFLKVIAYGLLFHPNAYLRNGWNLLDFIIVVVGLFSAILEQATKADGANALGGKGAGFDVKALRAFRVLRPLRLVSGVPSLQVVLNSIIKAMVPLLHIALLVLFVIIIYAIIGLELFMGKMHKTCYNQEGVADVPAEDDPSPCALETGHGRQCQNGTVCKPGWDGPKHGITNFDNFAFAMLTVFQCITMEGWTDVLYWMQDAMGYELPWVYFVSLVIFGSFFVLNLVLGVLSGEFSKEREKAKARGDFQKLREKQQLEEDLKGYLDWITQAEDIDPENEDEGMDEEKPRNMSMPTSETESVNTENVAGGDIEGENCGARLAHRISKSKFSRYWRRWNRFCRRKCRAAVKSNVFYWLVIFLVFLNTLTIASEHYNQPHWLTEVQDTANKALLALFTAEMLLKMYSLGLQAYFVSLFNRFDCFIVCGGILETILVETKVMSPLGISVLRCVRLLRIFKITRYWNSLSNLVASLLNSVRSIASLLLLLFLFIIIFSLLGMQLFGGKFNFDEMQTRRSTFDNFPQSLLTVFQILTGEDWNSVMYDGIMAYGGPSFPGMLVCIYFIILFICGNYILLNVFLAIAVDNLADAESLTSAQKEEEEEKERKKLARTASPEKKQEVVGKPALEEAKEEKIELKSITADGESPPTTKINMDDLQPNESEDKSPYPNPETTGEEDEEEPEMPVGPRPRPLSELHLKEKAVPMPEASAFFIFSPNNRFRLQCHRIVNDTIFTNLILFFILLSSISLAAEDPVQHTSFRNHILFYFDIVFTTIFTIEIALKMTAYGAFLHKGSFCRNYFNILDLLVVSVSLISFGIQSSAINVVKILRVLRVLRPLRAINRAKGLKHVVQCVFVAIRTIGNIVIVTTLLQFMFACIGVQLFKGKLYTCSDSSKQTEAECKGNYITYKDGEVDHPIIQPRSWENSKFDFDNVLAAMMALFTVSTFEGWPELLYRSIDSHTEDKGPIYNYRVEISIFFIIYIIIIAFFMMNIFVGFVIVTFQEQGEQEYKNCELDKNQRQCVEYALKARPLRRYIPKNQHQYKVWYVVNSTYFEYLMFVLILLNTICLAMQHYGQSCLFKIAMNILNMLFTGLFTVEMILKLIAFKPKGYFSDPWNVFDFLIVIGSIIDVILSETNNAEENSRISITFFRLFRVMRLVKLLSRGEGIRTLLWTFIKSFQALPYVALLIVMLFFIYAVIGMQVFGKIALNDTTEINRNNNFQTFPQAVLLLFRCATGEAWQDIMLACMPGKKCAPESEPHNSTEGETPCGSSFAVFYFISFYMLCAFLIINLFVAVIMDNFDYLTRDWSILGPHHLDEFKRIWAEYDPEAKGRIKHLDVVTLLRRIQPPLGFGKLCPHRVACKRLVSMNMPLNSDGTVMFNATLFALVRTALRIKTEGNLEQANEELRAIIKKIWKRTSMKLLDQVVPPAGDDEVTVGKFYATFLIQEYFRKFKKRKEQGLVGKPSQRNALSLQAGLRTLHDIGPEIRRAISGDLTAEEELDKAMKEAVSAASEDDIFRRAGGLFGNHVSYYQSDSRSAFPQTFTTQRPLHISKAGNNQGDTESPSHEKLVDSTFTPSSYSSTGSNANINNANNTALGRLPRPAGYPSTVSTVEGHGSPLSPAVRAQEAAWKLSSKRCHSQESQIAMACQEGASQDDNYDVRIGEDAECCSEPSLLSTEMLSYQDDENRQLAPPEEEKRDIRLSPKKGFLRSASLGRRASFHLECLKRQKNQGGDISQKTVLPLHLVHHQALAVAGLSPLLQRSHSPTSLPRPCATPPATPGSRGWPPQPIPTLRLEGADSSEKLNSSFPSIHCGSWSGENSPCRGDSSAARRARPVSLTVPSQAGAQGRQFHGSASSLVEAVLISEGLGQFAQDPKFIEVTTQELADACDLTIEEMENAADDILSGGARQSPNGTLLPFVNRRDPGRDRAGQNEQDASGACAPGCGQSEEALADRRAGVSSL',
        'P15381-2' : 'MLRALVQPATPAYQPLPSHLSAETESTCKGTVVHEAQLNHFYISPGGSNYGSPRPAHANMNANAAAGLAPEHIPTPGAALSWQAAIDAARQAKLMGSAGNATISTVSSTQRKRQQYGKPKKQGSTTATRPPRALLCLTLKNPIRRACISIVEWKPFEIIILLTIFANCVALAIYIPFPEDDSNATNSNLERVEYLFLIIFTVEAFLKVIAYGLLFHPNAYLRNGWNLLDFIIVVVGLFSAILEQATKADGANALGGKGAGFDVKALRAFRVLRPLRLVSGVPSLQVVLNSIIKAMVPLLHIALLVLFVIIIYAIIGLELFMGKMHKTCYNQEGVADVPAEDDPSPCALETGHGRQCQNGTVCKPGWDGPKHGITNFDNFAFAMLTVFQCITMEGWTDVLYWMQDAMGYELPWVYFVSLVIFGSFFVLNLVLGVLSGEFSKEREKAKARGDFQKLREKQQLEEDLKGYLDWITQAEDIDPENEDEGMDEEKPRNMSMPTSETESVNTENVAGGDIEGENCGARLAHRISKSKFSRYWRRWNRFCRRKCRAAVKSNVFYWLVIFLVFLNTLTIASEHYNQPHWLTEVQDTANKALLALFTAEMLLKMYSLGLQAYFVSLFNRFDCFIVCGGILETILVETKVMSPLGISVLRCVRLLRIFKITRYWNSLSNLVASLLNSVRSIASLLLLLFLFIIIFSLLGMQLFGGKFNFDEMQTRRSTFDNFPQSLLTVFQILTGEDWNSVMYDGIMAYGGPSFPGMLVCIYFIILFICGNYILLNVFLAIAVDNLADAESLTSAQKEEEEEKERKKLARTASPEKKQEVVGKPALEEAKEEKIELKSITADGESPPTTKINMDDLQPNESEDKSPYPNPETTGEEDEEEPEMPVGPRPRPLSELHLKEKAVPMPEASAFFIFSPNNRFRLQCHRIVNDTIFTNLILFFILLSSISLAAEDPVQHTSFRNHILFYFDIVFTTIFTIEIALKMTAYGAFLHKGSFCRNYFNILDLLVVSVSLISFGIQSSAINVVKILRVLRVLRPLRAINRAKGLKHVVQCVFVAIRTIGNIVIVTTLLQFMFACIGVQLFKGKLYTCSDSSKQTEAECKGNYITYKDGEVDHPIIQPRSWENSKFDFDNVLAAMMALFTVSTFEGWPELLYRSIDSHTEDKGPIYNYRVEISIFFIIYIIIIAFFMMNIFVGFVIVTFQEQGEQEYKNCELDKNQRQCVEYALKARPLRRYIPKNQHQYKVWYVVNSTYFEYLMFVLILLNTICLAMQHYGQSCLFKIAMNILNMLFTGLFTVEMILKLIAFKPKHYFCDAWNTFDALIVVGSIVDIAITEVHPAEHTQCSPSMNAEENSRISITFFRLFRVMRLVKLLSRGEGIRTLLWTFIKSFQALPYVALLIVMLFFIYAVIGMQVFGKIALNDTTEINRNNNFQTFPQAVLLLFRCATGEAWQDIMLACMPGKKCAPESEPHNSTEGETPCGSSFAVFYFISFYMLCAFLIINLFVAVIMDNFDYLTRDWSILGPHHLDEFKRIWAEYDPEAKGRIKHLDVVTLLRRIQPPLGFGKLCPHRVACKRLVSMNMPLNSDGTVMFNATLFALVRTALRIKTEGNLEQANEELRAIIKKIWKRTSMKLLDQVVPPAGDDEVTVGKFYATFLIQEYFRKFKKRKEQGLVGKPSQRNALSLQAGLRTLHDIGPEIRRAISGDLTAEEELDKAMKEAVSAASEDDIFRRAGGLFGNHVSYYQSDSRSAFPQTFTTQRPLHISKAGNNQGDTESPSHEKLVDSTFTPSSYSSTGSNANINNANNTALGRLPRPAGYPSTVSTVEGHGSPLSPAVRAQEAAWKLSSKRCHSQESQIAMACQEGASQDDNYDVRIGEDAECCSEPSLLSTEMLSYQDDENRQLAPPEEEKRDIRLSPKKGFLRSASLGRRASFHLECLKRQKNQGGDISQKTVLPLHLVHHQALAVAGLSPLLQRSHSPTSLPRPCATPPATPGSRGWPPQPIPTLRLEGADSSEKLNSSFPSIHCGSWSGENSPCRGDSSAARRARPVSLTVPSQAGAQGRQFHGSASSLVEAVLISEGLGQFAQDPKFIEVTTQELADACDLTIEEMENAADDILSGGARQSPNGTLLPFVNRRDPGRDRAGQNEQDASGACAPGCGQSEEALADRRAGVSSL'
    }

})
//})