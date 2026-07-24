import { Component, computed } from '@angular/core';
import { ThreeDTilt } from '../../directives/three-d-tilt';
import { LanguageService } from '../../services/language';

interface Project {
  title: string;
  category: string;
  categoryClass: string;
  description: string;
  imageUrl: string;
  icons: string[];
  borderClass?: string;
  isFeatured?: boolean;
}

@Component({
  selector: 'app-projects',
  imports: [ThreeDTilt],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  constructor(public langService: LanguageService) {}

  projects = computed<Project[]>(() => {
    const t = this.langService.t();
    return [
      {
        title: 'Sistema MIP',
        category: 'SaaS',
        categoryClass: 'bg-primary/90 text-on-primary',
        description: t.projects.proj1Desc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGDGY4byOd0HsPBGmKAs1UzZjSa9Tr93AUt6m4NgGvM-v9wEkokDe_D116zuUL4_edraLxbyp9_ePIyILz_zInzcY__TkUcAAJJrSehs-kPnFsooKm33GzIrJDrYtxYEoJc4hsUfoVafsNHfRK4fESAQ-aSMyMYgOiDSdrxs1cElCFbDmkgb1WLROpFQqF3qcSihYGB1oUHa5-mGyjqJwZKOqfGVc6GatXmcxSq2DZvI5IuHl2aj2f0JWpd0ZVOnhbhDtC1SW6k9o',
        icons: ['database', 'cloud_done']
      },
      {
        title: 'Círculo Rojo',
        category: 'MOBILE',
        categoryClass: 'bg-secondary/90 text-on-secondary',
        description: t.projects.proj2Desc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBITgj8r0zbphqhSuXJIhTOL4yfJX4e3O-6-qxcru9k_30AvZp801MSHqkS3oyn9WiyawtgbyH7NFEooysvAhuxyR_mnoOJuDbLS1W_6God7jcQEnVTudSpPGFxXuKfXABgb9-2vPV3nvLbYisvQUXI_u4LiL93t2qQbJLGl1Pnn6jMhSYM-7XnfATkLpmJS4l5Mb0H03Jjo1EO1yB-xqMCZf4WHdVaA2sKOG65bp-xRqfI0WUhhcn32fS_7bvzltfHrQwoioFQkwM',
        icons: ['smartphone', 'bolt']
      },
      {
        title: 'Coach Virtual',
        category: 'AI ENGINE',
        categoryClass: 'bg-tertiary-container text-on-tertiary-container',
        description: t.projects.proj3Desc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1jIBsuYuP13OyxVrPxdi6SuVPODTFbO7AZU9o8jt4Ws--Cw6gTiWEeq5ShSnS07CfLC_2Mw1U-4OqRxC2WeAXu4AgMk2z6VbZNFx7FP6kayldm2z_8Gf9WOAXWB3NZ1Z2WXmQRClTRfB7CvzGW0_KnDPxQKOaaNazD8JO23WWntiq9dhnioTzPKRcuaCP8zcAnT_BpYRxpcmluMmBCL-m_18H_NMjNCsSU7TzS3MYEEcZS4Z29H_MVJ6lfK5OdSxviKa2qLm_-Is',
        icons: ['psychology', 'auto_awesome'],
        borderClass: 'border-primary/30',
        isFeatured: true
      },
      {
        title: 'Veterinaria SaaS',
        category: 'SAAS',
        categoryClass: 'bg-primary/90 text-on-primary',
        description: t.projects.proj4Desc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLCDlDB2qHMEazW8iWPqDmNlada46jl91L9ScPc3kibI1_ZeItAlB1Qs-szhtJyFO2bAGSV2usmCGALVNWithLaLqhh9He_xIvHB5UGM3JbRuvmpfYBv4zT2EMXel7Ydf4lWLRtwslHWQYSvPZJWyb0_HPeZ2O80l-RcVay5Jex40N4Q8t-hjDWNsKOOkfWIOwJMZcsq5-OrarqA932yxHgGdXIT01FyDsYMaKIAUwHM01CXHE35MmVj2X8Z34D1nWzOmnDL24ptk',
        icons: ['pets']
      },
      {
        title: 'Control de Asistencia',
        category: 'ENTERPRISE',
        categoryClass: 'bg-primary/90 text-on-primary',
        description: t.projects.proj5Desc,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChs2UrgNmWyPiKkVL5Xf7E2SpXq_UY67DjFKshkfgvxPH7Mt_NgOoriuXvpXxpYFuGMpQ02OrZXmncfxiobcSfKcNrmhdUNgawYh0EHGRV2FbXVqkqqjG4giNAXufqFyVirNA3qZpnW7PeTtbeKqyLV2QRX6X8EQ2AxEKxF6pUh_mefxT05RcfRNM0Q-VUDF3j9pXzrqqfHMurOdkrAjO6T__Z9eZ6QhIGOVV1WEvBZHYQ2AA-GPY8xyWNsVDIaebpJB69ABR1i9Q',
        icons: ['fingerprint']
      }
    ];
  });
}
