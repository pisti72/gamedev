class Sakk:
    def __init__(self):
        self.tabla = self.alaphelyzet()
        self.jatekos = "feher"  # Kezdő játékos

    def alaphelyzet(self):
        # Inicializálja a sakktáblát a kezdő pozícióval
        return [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p"] * 8,
            [""] * 8,
            [""] * 8,
            [""] * 8,
            [""] * 8,
            ["P"] * 8,
            ["R", "N", "B", "Q", "K", "B", "N", "R"],
        ]

    def megjelenit(self):
        print("\n  a b c d e f g h")
        print("  " + "-" * 15)
        for i, sor in enumerate(self.tabla):
            print(8 - i, " ".join(mező if mező else "." for mező in sor))
        print()

    def poziciobol_index(self, pozicio):
        oszlop = ord(pozicio[0]) - ord("a")  # 'a' -> 0, 'b' -> 1, stb.
        sor = 8 - int(pozicio[1])           # '8' -> 0, '7' -> 1, stb.
        return sor, oszlop

    def ervenyes_lepes(self, kezd, cel):
        print(f"Érvényesség ellenőrzése: {kezd} -> {cel}")
        kezd_sor, kezd_oszlop = self.poziciobol_index(kezd)
        cel_sor, cel_oszlop = self.poziciobol_index(cel)
        figura = self.tabla[kezd_sor][kezd_oszlop]
        print(f"Figurát talált: {figura} a {kezd_sor, kezd_oszlop} pozíción")

        if not figura:
            print("Nincs figura a kiinduló helyen.")
            return False  # Nincs figura a kiinduló helyen

        # Ellenőrizd a lépést figura alapján
        if figura.lower() == "p":  # Gyalog
            return self.gyalog_lepes(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop, figura)
        elif figura.lower() == "r":  # Bástya
            return self.bastya_lepes(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop)
        elif figura.lower() == "n":  # Huszár
            return self.huszar_lepes(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop)
        elif figura.lower() == "b":  # Futó
            return self.futo_lepes(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop)
        elif figura.lower() == "q":  # Vezér
            return self.vezér_lepes(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop)
        elif figura.lower() == "k":  # Király
            return self.kiraly_lepes(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop)
        return False

    def gyalog_lepes(self, kezd_sor, kezd_oszlop, cel_sor, cel_oszlop, figura):
        irany = -1 if figura.isupper() else 1  # Fehér felfelé, fekete lefelé
        kezdosor = 6 if figura.isupper() else 1  # Fehér kezdősor (6), fekete kezdősor (1)

        # Egy mező előrelépés
        if (cel_sor == kezd_sor + irany and cel_oszlop == kezd_oszlop and 
                not self.tabla[cel_sor][cel_oszlop]):
            print(f"Gyalog előrelépés: {kezd_sor, kezd_oszlop} -> {cel_sor, cel_oszlop}")
            return True

        # Ütés átlósan
        if (cel_sor == kezd_sor + irany and abs(cel_oszlop - kezd_oszlop) == 1 and 
                self.tabla[cel_sor][cel_oszlop]):
            print(f"Gyalog ütés: {kezd_sor, kezd_oszlop} -> {cel_sor, cel_oszlop}")
            return True
        
        # Dupla lépés a kezdősorról
        if (kezd_sor == kezdosor and cel_sor == kezd_sor + 2 * irany and cel_oszlop == kezd_oszlop and 
                not self.tabla[kezd_sor + irany][cel_oszlop] and not self.tabla[cel_sor][cel_oszlop]):
            return True

        return False

    def bastya_lepes(self, kezd_sor, kezd_oszlop, cel_sor, cel_oszlop):
        if kezd_sor == cel_sor or kezd_oszlop == cel_oszlop:  # Egyenes mozgás
            return self.utvonal_szabad(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop)
        return False

    def huszar_lepes(self, kezd_sor, kezd_oszlop, cel_sor, cel_oszlop):
        return (abs(kezd_sor - cel_sor), abs(kezd_oszlop - cel_oszlop)) in [(2, 1), (1, 2)]

    def futo_lepes(self, kezd_sor, kezd_oszlop, cel_sor, cel_oszlop):
        if abs(kezd_sor - cel_sor) == abs(kezd_oszlop - cel_oszlop):  # Átlós mozgás
            return self.utvonal_szabad(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop)
        return False

    def vezér_lepes(self, kezd_sor, kezd_oszlop, cel_sor, cel_oszlop):
        # Vezér a bástya és a futó mozgásának kombinációja
        return self.bastya_lepes(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop) or \
               self.futo_lepes(kezd_sor, kezd_oszlop, cel_sor, cel_oszlop)

    def kiraly_lepes(self, kezd_sor, kezd_oszlop, cel_sor, cel_oszlop):
        return max(abs(kezd_sor - cel_sor), abs(kezd_oszlop - cel_oszlop)) == 1

    def utvonal_szabad(self, kezd_sor, kezd_oszlop, cel_sor, cel_oszlop):
        # Ellenőrzi, hogy nincs akadály az útvonalon (nem a célmezőn)
        d_sor = (cel_sor - kezd_sor) // max(1, abs(cel_sor - kezd_sor))
        d_oszlop = (cel_oszlop - kezd_oszlop) // max(1, abs(cel_oszlop - kezd_oszlop))
        sor, oszlop = kezd_sor + d_sor, kezd_oszlop + d_oszlop
        while (sor, oszlop) != (cel_sor, cel_oszlop):
            if self.tabla[sor][oszlop]:
                return False
            sor += d_sor
            oszlop += d_oszlop
        return True

    def lepes(self, kezd, cel):
        print(f"Próbálkozás lépéssel: {kezd} -> {cel}")
        # Ellenőrizzük, hogy a megfelelő színű figurával próbálunk lépni
        kezd_sor, kezd_oszlop = self.poziciobol_index(kezd)
        figura = self.tabla[kezd_sor][kezd_oszlop]
        
        if not figura:
            print("Nincs figura a kezdőmezőn!")
            return False
        
        if (self.jatekos == "feher" and figura.islower()) or (self.jatekos == "fekete" and figura.isupper()):
            print("Nem a saját figuráddal próbálsz lépni!")
            return False
    
        if self.ervenyes_lepes(kezd, cel):
            kezd_sor, kezd_oszlop = self.poziciobol_index(kezd)
            cel_sor, cel_oszlop = self.poziciobol_index(cel)
            print(f"Lépés engedélyezve: {self.tabla[kezd_sor][kezd_oszlop]} -> {kezd_sor, kezd_oszlop} to {cel_sor, cel_oszlop}")
            self.tabla[cel_sor][cel_oszlop] = self.tabla[kezd_sor][kezd_oszlop]
            self.tabla[kezd_sor][kezd_oszlop] = ""
            # Játékos váltása
            if self.jatekos == "feher":
                self.jatekos = "fekete"
            else:
                self.jatekos = "feher"
            return True
        else:
            print(f"Lépés elutasítva: {kezd} -> {cel}")
            return False

# Fő program
if __name__ == "__main__":
    jatek = Sakk()
    while True:
        jatek.megjelenit()
        print(f"{jatek.jatekos.capitalize()} játékos következik.")
        lepes = input("Add meg a lépést (pl. e2e4): ")
        if lepes == "exit":
            print("Kiléptél a játékból.")
            exit()
        if len(lepes) == 4:
            kezd, cel = lepes[:2], lepes[2:]
            if jatek.lepes(kezd, cel):
                print("Lépés megtörtént.")
            else:
                print("Érvénytelen lépés! Próbáld újra.")
        else:
            print("Helytelen formátum! Adj meg egy lépést (pl. e2e4).")
