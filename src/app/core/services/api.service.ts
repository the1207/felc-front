import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DomaineResponse,
  FormationResponse,
  FormationDetailResponse,
  InscriptionResponse,
  SoumissionResponse,
  CertificatResponse,
  CertificatVerificationResponse,
  OffreResponse,
  CandidatureResponse,
  OrientationResponse,
  PortfolioResponse,
  SujetResponse,
  SujetDetailResponse,
  MessageForumResponse,
  AdminStatsResponse,
  AdminUserResponse,
  UserResponse
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  // ==================== DOMAINES ====================
  getDomaines(): Observable<DomaineResponse[]> {
    return this.http.get<DomaineResponse[]>('/api/domaines');
  }

  createDomaine(data: { nom: string; code: string; description?: string }): Observable<DomaineResponse> {
    return this.http.post<DomaineResponse>('/api/domaines', data);
  }

  // ==================== FORMATIONS ====================
  getFormations(niveau?: string, domaineId?: number): Observable<FormationResponse[]> {
    let params = new HttpParams();
    if (niveau) params = params.set('niveau', niveau);
    if (domaineId) params = params.set('domaineId', domaineId.toString());
    return this.http.get<FormationResponse[]>('/api/formations', { params });
  }

  getFormationById(id: number): Observable<FormationDetailResponse> {
    return this.http.get<FormationDetailResponse>(`/api/formations/${id}`);
  }

  createFormation(data: { titre: string; description: string; niveau: string; domaineId: number }): Observable<FormationResponse> {
    return this.http.post<FormationResponse>('/api/formations', data);
  }

  // ==================== MODULES & EXERCICES ====================
  createModule(formationId: number, data: { titre: string; contenu: string; ordre: number }) {
    return this.http.post(`/api/formations/${formationId}/modules`, data);
  }

  createExercice(formationId: number, data: { titre: string; consigne: string; criteres: string; ordre: number; projetFinal: boolean }) {
    return this.http.post(`/api/formations/${formationId}/exercices`, data);
  }

  // ==================== INSCRIPTIONS ====================
  inscrire(formationId: number): Observable<InscriptionResponse> {
    return this.http.post<InscriptionResponse>(`/api/formations/${formationId}/inscription`, {});
  }

  getMesInscriptions(): Observable<InscriptionResponse[]> {
    return this.http.get<InscriptionResponse[]>('/api/inscriptions/me');
  }

  // ==================== SOUMISSIONS ====================
  soumettreExercice(exerciceId: number, data: { lienDepot: string; commentaire?: string }): Observable<SoumissionResponse> {
    return this.http.post<SoumissionResponse>(`/api/exercices/${exerciceId}/soumissions`, data);
  }

  getMesSoumissions(): Observable<SoumissionResponse[]> {
    return this.http.get<SoumissionResponse[]>('/api/soumissions/me');
  }

  getSoumissionsAEvaluer(): Observable<SoumissionResponse[]> {
    return this.http.get<SoumissionResponse[]>('/api/soumissions/a-evaluer');
  }

  evaluerSoumission(id: number, data: { note: number; feedback: string }): Observable<SoumissionResponse> {
    return this.http.put<SoumissionResponse>(`/api/soumissions/${id}/evaluation`, data);
  }

  corrigerSoumissionIa(id: number): Observable<SoumissionResponse> {
    return this.http.post<SoumissionResponse>(`/api/soumissions/${id}/correction-ia`, {});
  }

  // ==================== CERTIFICATS ====================
  getMesCertificats(): Observable<CertificatResponse[]> {
    return this.http.get<CertificatResponse[]>('/api/certificats/me');
  }

  verifierCertificat(code: string): Observable<CertificatVerificationResponse> {
    return this.http.get<CertificatVerificationResponse>(`/api/certificats/verify/${code}`);
  }

  // ==================== OFFRES & CANDIDATURES ====================
  getOffres(paramsObj?: { type?: string; domaineId?: number; remote?: boolean; q?: string }): Observable<OffreResponse[]> {
    let params = new HttpParams();
    if (paramsObj?.type) params = params.set('type', paramsObj.type);
    if (paramsObj?.domaineId) params = params.set('domaineId', paramsObj.domaineId.toString());
    if (paramsObj?.remote !== undefined) params = params.set('remote', paramsObj.remote.toString());
    if (paramsObj?.q) params = params.set('q', paramsObj.q);
    return this.http.get<OffreResponse[]>('/api/offres', { params });
  }

  getOffreById(id: number): Observable<OffreResponse> {
    return this.http.get<OffreResponse>(`/api/offres/${id}`);
  }

  getMesOffres(): Observable<OffreResponse[]> {
    return this.http.get<OffreResponse[]>('/api/offres/me');
  }

  createOffre(data: {
    titre: string;
    description: string;
    type: string;
    domaineId: number;
    localisation: string;
    remote: boolean;
    experienceMin: number;
    budget: number;
  }): Observable<OffreResponse> {
    return this.http.post<OffreResponse>('/api/offres', data);
  }

  changerStatutOffre(id: number, statut: string): Observable<OffreResponse> {
    return this.http.put<OffreResponse>(`/api/offres/${id}/statut`, { statut });
  }

  postuler(offreId: number, data: { message: string; lienPortfolio?: string }): Observable<CandidatureResponse> {
    return this.http.post<CandidatureResponse>(`/api/offres/${offreId}/candidatures`, data);
  }

  getMesCandidatures(): Observable<CandidatureResponse[]> {
    return this.http.get<CandidatureResponse[]>('/api/candidatures/me');
  }

  getCandidaturesOffre(offreId: number): Observable<CandidatureResponse[]> {
    return this.http.get<CandidatureResponse[]>(`/api/offres/${offreId}/candidatures`);
  }

  changerStatutCandidature(candidatureId: number, statut: string): Observable<CandidatureResponse> {
    return this.http.put<CandidatureResponse>(`/api/candidatures/${candidatureId}/statut`, { statut });
  }

  // ==================== ORIENTATION IA ====================
  orienterProfil(data: {
    domaineId: number;
    niveauActuel: string;
    objectifs: string;
    tempsDisponibleHeuresParSemaine: number;
  }): Observable<OrientationResponse> {
    return this.http.post<OrientationResponse>('/api/orientation', data);
  }

  // ==================== PORTFOLIO ====================
  getMonPortfolio(): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>('/api/portfolio/me');
  }

  getPortfolioPublic(userId: number): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(`/api/portfolio/${userId}`);
  }

  changerVisibilitePortfolio(portfolioPublic: boolean): Observable<UserResponse> {
    return this.http.put<UserResponse>('/api/portfolio/me/visibilite', { portfolioPublic });
  }

  // ==================== FORUM ====================
  getSujets(domaineId?: number): Observable<SujetResponse[]> {
    let params = new HttpParams();
    if (domaineId) params = params.set('domaineId', domaineId.toString());
    return this.http.get<SujetResponse[]>('/api/forum/sujets', { params });
  }

  getSujetById(id: number): Observable<SujetDetailResponse> {
    return this.http.get<SujetDetailResponse>(`/api/forum/sujets/${id}`);
  }

  creerSujet(data: { titre: string; contenu: string; domaineId: number }): Observable<SujetResponse> {
    return this.http.post<SujetResponse>('/api/forum/sujets', data);
  }

  repondreSujet(sujetId: number, data: { contenu: string }): Observable<MessageForumResponse> {
    return this.http.post<MessageForumResponse>(`/api/forum/sujets/${sujetId}/messages`, data);
  }

  marquerSolution(sujetId: number, messageId: number): Observable<MessageForumResponse> {
    return this.http.put<MessageForumResponse>(`/api/forum/sujets/${sujetId}/messages/${messageId}/solution`, {});
  }

  // ==================== ADMIN ====================
  getAdminStats(): Observable<AdminStatsResponse> {
    return this.http.get<AdminStatsResponse>('/api/admin/stats');
  }

  getAdminUsers(role?: string): Observable<AdminUserResponse[]> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    return this.http.get<AdminUserResponse[]>('/api/admin/users', { params });
  }

  changerActivationUser(id: number, actif: boolean): Observable<AdminUserResponse> {
    return this.http.put<AdminUserResponse>(`/api/admin/users/${id}/activation`, { actif });
  }

  getAdminOffres(): Observable<OffreResponse[]> {
    return this.http.get<OffreResponse[]>('/api/admin/offres');
  }

  // ==================== USER PROFILE ====================
  getMonProfil(): Observable<UserResponse> {
    return this.http.get<UserResponse>('/api/users/me');
  }

  updateMonProfil(data: { nom: string; prenom: string; localisation?: string; bio?: string; lienGithub?: string; lienLinkedin?: string }): Observable<UserResponse> {
    return this.http.put<UserResponse>('/api/users/me', data);
  }
}
