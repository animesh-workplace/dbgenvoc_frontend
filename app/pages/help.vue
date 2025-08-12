<template>
	<div class="help-container">
		<!-- Header Section -->
		<div class="help-header">
			<h1 class="main-title">
				<i class="fas fa-dna"></i>
				dbGENVOC Help Center
			</h1>
			<p class="subtitle">Your comprehensive guide to using the Genomic Variants of Oral Cancer Database</p>
		</div>

		<!-- Navigation Pills -->
		<div class="help-nav">
			<button class="nav-pill" data-section="about"><i class="fas fa-info-circle"></i> About</button>
			<button class="nav-pill" data-section="search"><i class="fas fa-search"></i> Search Guide</button>
			<button class="nav-pill active" data-section="results">
				<i class="fas fa-table"></i> Results & Filtering
			</button>
		</div>

		<!-- Content Sections -->
		<div class="help-content">
			<!-- About Section -->
			<section id="about-section" class="content-section">
				<div class="section-card">
					<div class="card-header">
						<h2><i class="fas fa-database"></i> About dbGENVOC</h2>
					</div>
					<div class="card-body">
						<p class="lead">
							dbGENVOC is a comprehensive, flexible database framework designed to provide
							researchers with access to somatic variation data from Indian oral cancer patients.
						</p>

						<div class="feature-grid">
							<div class="feature-item">
								<div class="feature-icon">
									<i class="fas fa-chart-bar"></i>
								</div>
								<h4>24M+ Variants</h4>
								<p>From 100 Indian oral cancer patients (WES) and 5 patients (WGS)</p>
							</div>

							<div class="feature-item">
								<div class="feature-icon">
									<i class="fas fa-globe-americas"></i>
								</div>
								<h4>TCGA Data</h4>
								<p>220 patient samples from TCGA-HNSCC project (USA)</p>
							</div>

							<div class="feature-item">
								<div class="feature-icon">
									<i class="fas fa-book"></i>
								</div>
								<h4>Literature Data</h4>
								<p>Manually curated data from 118 patients in published studies</p>
							</div>
						</div>

						<div class="data-summary">
							<h3><i class="fas fa-table"></i> Data Summary</h3>
							<div class="summary-stats">
								<div class="stat-item">
									<span class="stat-number">~24M</span>
									<span class="stat-label">Somatic Variants</span>
								</div>
								<div class="stat-item">
									<span class="stat-number">325+</span>
									<span class="stat-label">Total Patients</span>
								</div>
								<div class="stat-item">
									<span class="stat-number">3</span>
									<span class="stat-label">Data Sources</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Search Guide Section -->
			<section id="search-section" class="content-section">
				<div class="section-card">
					<div class="card-header">
						<h2><i class="fas fa-search"></i> Search Guide</h2>
					</div>
					<div class="card-body">
						<div class="search-intro">
							<div class="intro-box">
								<i class="fas fa-lightbulb"></i>
								<p>
									Use the live search box on the home page to quickly find variants by entering
									gene names, genomic regions, or patient IDs. Auto-complete and spell-checking
									are enabled!
								</p>
							</div>
						</div>

						<div class="search-options">
							<h3>Search Options</h3>

							<div class="option-grid">
								<div class="search-option">
									<div class="option-header">
										<i class="fas fa-dna"></i>
										<h4>Gene Search</h4>
									</div>
									<p>Search by gene symbol, alias, or name</p>
									<div class="example">
										<strong>Example:</strong> <code>BRCA2</code>, <code>TP53</code>
									</div>
								</div>

								<div class="search-option">
									<div class="option-header">
										<i class="fas fa-map-marked-alt"></i>
										<h4>Genomic Region</h4>
									</div>
									<p>Search specific chromosomal regions (max 100KB)</p>
									<div class="example">
										<strong>Example:</strong> <code>1:915188-1015188</code>
									</div>
								</div>

								<div class="search-option">
									<div class="option-header">
										<i class="fas fa-list"></i>
										<h4>Multi-Gene</h4>
									</div>
									<p>Search multiple genes simultaneously</p>
									<div class="example">
										<strong>Example:</strong> <code>TP53 BRCA2 NOTCH1</code>
									</div>
								</div>

								<div class="search-option">
									<div class="option-header">
										<i class="fas fa-crosshairs"></i>
										<h4>Multi-Sites</h4>
									</div>
									<p>Search multiple specific genomic positions</p>
									<div class="example">
										<strong>Example:</strong> <code>chr11:534289,chr17:7578406</code>
									</div>
								</div>

								<div class="search-option">
									<div class="option-header">
										<i class="fas fa-user"></i>
										<h4>Patient ID</h4>
									</div>
									<p>Search by specific patient identifier</p>
									<div class="example">
										<strong>Example:</strong> <code>NIBMG-F316-GB</code>, <code>OT54</code>
									</div>
								</div>

								<div class="search-option">
									<div class="option-header">
										<i class="fas fa-project-diagram"></i>
										<h4>Pathway Search</h4>
									</div>
									<p>Search by biological pathways</p>
									<div class="example">
										<strong>Example:</strong> <code>Wnt signaling pathway</code>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Results Section -->
			<section id="results-section" class="content-section active">
				<div class="section-card">
					<div class="card-header">
						<h2><i class="fas fa-table"></i> Results & Filtering</h2>
					</div>
					<div class="card-body">
						<div class="results-overview">
							<h3><i class="fas fa-eye"></i> Results Page Overview</h3>
							<p>The results page is organized into three main panels for easy data exploration:</p>

							<div class="panel-grid">
								<div class="panel-item">
									<div class="panel-number">1</div>
									<h4>dbGENVOC Data</h4>
									<p>Detailed variant information from our database</p>
								</div>
								<div class="panel-item">
									<div class="panel-number">2</div>
									<h4>TCGA Data</h4>
									<p>Corresponding variants from TCGA oral cancer data</p>
								</div>
								<div class="panel-item">
									<div class="panel-number">3</div>
									<h4>Literature Data</h4>
									<p>Curated variations from peer-reviewed publications</p>
								</div>
							</div>
						</div>

						<div class="filtering-tools">
							<h3><i class="fas fa-filter"></i> Filtering & Tools</h3>

							<div class="tools-grid">
								<div class="tool-item">
									<i class="fas fa-eye"></i>
									<h4>View Options</h4>
									<p>Adjust the number of rows displayed using the dropdown menu</p>
								</div>

								<div class="tool-item">
									<i class="fas fa-search"></i>
									<h4>Search Within Results</h4>
									<p>Use the search box above data tables to filter current results</p>
								</div>

								<div class="tool-item">
									<i class="fas fa-sort"></i>
									<h4>Sorting</h4>
									<p>Click on any column header to sort data ascending or descending</p>
								</div>

								<div class="tool-item">
									<i class="fas fa-columns"></i>
									<h4>Show/Hide Columns</h4>
									<p>Customize your view by showing or hiding specific data columns</p>
								</div>

								<div class="tool-item">
									<i class="fas fa-download"></i>
									<h4>Download Results</h4>
									<p>Export your search results in Excel format for further analysis</p>
								</div>
							</div>
						</div>

						<div class="tips-section">
							<h3><i class="fas fa-tips"></i> Pro Tips</h3>
							<div class="tips-grid">
								<div class="tip-item">
									<i class="fas fa-bolt"></i>
									<p>
										Use the <strong>Somatic</strong> button to switch between Exome and Whole
										Genome data views
									</p>
								</div>
								<div class="tip-item">
									<i class="fas fa-filter"></i>
									<p>Combine multiple filters to narrow down results to exactly what you need</p>
								</div>
								<div class="tip-item">
									<i class="fas fa-save"></i>
									<p>Always download your results for offline analysis and record keeping</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<style scoped>
/* Help Container Styles */
.help-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	line-height: 1.6;
	color: #333;
}

/* Header Styles */
.help-header {
	text-align: center;
	margin-bottom: 40px;
	padding: 40px 20px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 15px;
	color: white;
}

.main-title {
	font-size: 2.5rem;
	margin-bottom: 15px;
	font-weight: 700;
}

.main-title i {
	margin-right: 15px;
	color: #ffd700;
}

.subtitle {
	font-size: 1.2rem;
	opacity: 0.9;
	margin: 0;
}

/* Navigation Pills */
.help-nav {
	display: flex;
	justify-content: center;
	gap: 10px;
	margin-bottom: 40px;
	flex-wrap: wrap;
}

.nav-pill {
	padding: 12px 24px;
	border: none;
	border-radius: 25px;
	background: #f8f9fa;
	color: #666;
	cursor: pointer;
	transition: all 0.3s ease;
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 8px;
}

.nav-pill:hover,
.nav-pill.active {
	background: #007bff;
	color: white;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Content Sections */
.content-section {
	display: none;
	animation: fadeIn 0.5s ease-in;
}

.content-section.active {
	display: block;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Card Styles */
.section-card {
	background: white;
	border-radius: 15px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	margin-bottom: 30px;
}

.card-header {
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	color: white;
	padding: 25px 30px;
}

.card-header h2 {
	margin: 0;
	font-size: 1.8rem;
	font-weight: 600;
}

.card-header i {
	margin-right: 12px;
}

.card-body {
	padding: 30px;
}

.lead {
	font-size: 1.1rem;
	color: #666;
	margin-bottom: 30px;
}

/* Feature Grid */
.feature-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 25px;
	margin: 30px 0;
}

.feature-item {
	text-align: center;
	padding: 25px;
	background: #f8f9fa;
	border-radius: 12px;
	transition: transform 0.3s ease;
}

.feature-item:hover {
	transform: translateY(-5px);
}

.feature-icon {
	width: 60px;
	height: 60px;
	margin: 0 auto 15px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 1.5rem;
}

.feature-item h4 {
	margin: 15px 0 10px;
	color: #333;
}

/* Data Summary */
.data-summary {
	background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
	padding: 25px;
	border-radius: 12px;
	margin-top: 30px;
}

.data-summary h3 {
	color: #2d3436;
	margin-bottom: 20px;
	text-align: center;
}

.summary-stats {
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	gap: 20px;
}

.stat-item {
	text-align: center;
}

.stat-number {
	display: block;
	font-size: 2rem;
	font-weight: bold;
	color: #2d3436;
}

.stat-label {
	font-size: 0.9rem;
	color: #636e72;
}

/* Search Options */
.search-intro {
	margin-bottom: 30px;
}

.intro-box {
	background: #e3f2fd;
	padding: 20px;
	border-radius: 10px;
	border-left: 4px solid #2196f3;
	display: flex;
	align-items: center;
	gap: 15px;
}

.intro-box i {
	font-size: 1.5rem;
	color: #2196f3;
}

.option-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 20px;
	margin-top: 25px;
}

.search-option {
	background: #f8f9fa;
	padding: 20px;
	border-radius: 10px;
	border: 1px solid #e9ecef;
	transition: all 0.3s ease;
}

.search-option:hover {
	border-color: #007bff;
	box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
}

.option-header {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 10px;
}

.option-header i {
	color: #007bff;
	font-size: 1.2rem;
}

.option-header h4 {
	margin: 0;
	color: #333;
}

.example {
	background: #fff;
	padding: 10px;
	border-radius: 5px;
	border-left: 3px solid #28a745;
	margin-top: 10px;
	font-size: 0.9rem;
}

.example code {
	background: #f8f9fa;
	padding: 2px 6px;
	border-radius: 3px;
	font-family: 'Courier New', monospace;
	color: #e83e8c;
}

/* Results & Filtering Styles */
.results-overview h3,
.filtering-tools h3,
.tips-section h3 {
	color: #333;
	border-bottom: 2px solid #007bff;
	padding-bottom: 10px;
	margin-bottom: 25px;
}

.panel-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	margin: 25px 0;
}

.panel-item {
	background: #f8f9fa;
	padding: 20px;
	border-radius: 10px;
	position: relative;
	border-left: 4px solid #007bff;
}

.panel-number {
	position: absolute;
	top: -10px;
	right: -10px;
	background: #007bff;
	color: white;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
}

.tools-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 20px;
	margin: 25px 0;
}

.tool-item {
	background: #fff;
	padding: 20px;
	border: 1px solid #e9ecef;
	border-radius: 8px;
	text-align: center;
	transition: all 0.3s ease;
}

.tool-item:hover {
	border-color: #007bff;
	box-shadow: 0 5px 15px rgba(0, 123, 255, 0.1);
}

.tool-item i {
	font-size: 2rem;
	color: #007bff;
	margin-bottom: 15px;
}

.tool-item h4 {
	color: #333;
	margin: 10px 0;
}

.tips-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 15px;
	margin-top: 20px;
}

.tip-item {
	background: #e8f5e8;
	padding: 15px;
	border-radius: 8px;
	border-left: 4px solid #28a745;
	display: flex;
	align-items: center;
	gap: 15px;
}

.tip-item i {
	color: #28a745;
	font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
	.help-container {
		padding: 10px;
	}

	.main-title {
		font-size: 2rem;
	}

	.nav-pill {
		font-size: 0.9rem;
		padding: 10px 16px;
	}

	.card-body {
		padding: 20px;
	}

	.feature-grid,
	.option-grid,
	.panel-grid,
	.tools-grid {
		grid-template-columns: 1fr;
	}

	.summary-stats {
		flex-direction: column;
		gap: 15px;
	}
}
</style>

<script setup>
// Navigation functionality
// document.addEventListener('DOMContentLoaded', function() {
//     const navPills = document.querySelectorAll('.nav-pill');
//     const contentSections = document.querySelectorAll('.content-section');

//     navPills.forEach(pill => {
//         pill.addEventListener('click', function() {
//             // Remove active class from all pills and sections
//             navPills.forEach(p => p.classList.remove('active'));
//             contentSections.forEach(s => s.classList.remove('active'));

//             // Add active class to clicked pill
//             this.classList.add('active');

//             // Show corresponding section
//             const sectionId = this.getAttribute('data-section') + '-section';
//             document.getElementById(sectionId).classList.add('active');
//         });
//     });
// });
</script>
